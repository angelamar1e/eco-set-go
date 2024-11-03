// UserGoalContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useUserContext } from "@/contexts/UserContext";
import { useLogsContext } from "@/contexts/UserLogs";
import { Alert } from "react-native";
import { UserLogs } from "@/types/UserLogs";
import { format } from "date-fns";

export type GoalData = {
  id: string;
  target: number;
  start_date: FirebaseFirestoreTypes.Timestamp;
  end_date: FirebaseFirestoreTypes.Timestamp;
  status: string;
  created_at: FirebaseFirestoreTypes.Timestamp;
};

type UserGoalContextProps = {
  latestGoal: GoalData | null;
  editGoal: boolean;
  progressImpact: number;
  progressPercentage: number;
  isComplete: boolean;
  toggleEdit: () => void;
  submitNewGoal: () => void;
  newStartDate: Date;
  newEndDate: Date;
  newTarget: number;
  setNewStartDate: (date: Date) => void;
  setNewEndDate: (date: Date) => void;
  setNewTarget: (target: number) => void;
};

const UserGoalContext = createContext<UserGoalContextProps | undefined>(undefined);

export const UserGoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userUid } = useUserContext();
  const { userLogs } = useLogsContext();
  const goalsDoc = firestore().collection("goals").doc(userUid);

  const [latestGoal, setLatestGoal] = useState<GoalData | null>(null);
  const [editGoal, setEditGoal] = useState(false);
  const [newStartDate, setNewStartDate] = useState<Date>(new Date());
  const [newEndDate, setNewEndDate] = useState<Date>(new Date());
  const [newTarget, setNewTarget] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);
  const [progressImpact, setProgressImpact] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = goalsDoc.onSnapshot(
      (goalRecord) => {
        if (!goalRecord.exists) {
          setLatestGoal(null);
          return;
        }
        const goalsData = goalRecord.data();
        if (!goalsData) {
          setLatestGoal(null);
          return;
        }
        const goalsArray = Object.entries(goalsData).map(([id, goal]) => ({
          id,
          ...goal,
        })) as GoalData[];
        goalsArray.sort((a, b) => b.created_at.toDate().getTime() - a.created_at.toDate().getTime());
        setLatestGoal(goalsArray[0] || null);
      },
      (error) => console.error("Error listening for goal updates:", error)
    );
    return () => {
      unsubscribe();
    } 
    }, [userUid]);

  const toggleEdit = () => setEditGoal(!editGoal);

  const calculateProgressImpact = () => {
    let totalImpact = 0;
    if (latestGoal && userLogs) {
      const { stringStartDate, stringEndDate } = convertTimestampToString(latestGoal.start_date, latestGoal.end_date);
      console.log("DATES", stringStartDate, stringEndDate);
      const startDate = latestGoal.start_date.toDate();
      const endDate = latestGoal.end_date.toDate();
      Object.entries(userLogs as UserLogs).forEach(([date, actions]) => {
        if (date >= stringStartDate && date <= stringEndDate) {
          for (const logEntry of Object.values(actions)) {
            if (typeof logEntry.impact === "number") {
              totalImpact += logEntry.impact;
            }
          }
        }
      });
    }
    setProgressImpact(totalImpact);
  };

  useEffect(() => {
    setIsComplete(progressImpact >= latestGoal?.target!)
  }, [latestGoal, progressImpact]);

  const convertTimestampToString = (
    startTimestamp: FirebaseFirestoreTypes.Timestamp,
    endTimestamp: FirebaseFirestoreTypes.Timestamp
  ) => {
    let startDate = new Date(startTimestamp.seconds * 1000);
    let endDate = new Date(endTimestamp.seconds * 1000);
    const stringStartDate = format(startDate, "yyyy-MM-dd");
    const stringEndDate = format(endDate, "yyyy-MM-dd");

    return { stringStartDate, stringEndDate };
  };

  const calculateProgressPercentage = () => {
    if (!latestGoal || latestGoal.target <= 0) return;
    setProgressPercentage(progressImpact / latestGoal.target);
  };

  useEffect(() => {
    calculateProgressImpact();
    console.log("PROGRESS IMPACT", progressImpact)
  }, [userLogs, latestGoal]);

  useEffect(() => {
    calculateProgressPercentage();
    console.log("PERCENT IMPACT", progressPercentage)
  }, [progressImpact, latestGoal, userLogs]);

  useEffect(() => {
    const getStatus = () => {
      let status = latestGoal?.status || "";
  
      // Only mark goal as "Completed" if it's fully complete
      if (isComplete) {
        status = "Completed";
      }
  
      // Update Firestore if status has changed
      if (status && status !== latestGoal?.status) {
        goalsDoc.set(
          {
            [latestGoal?.id!]: {
              ...latestGoal,
              status: status,
            },
          },
          { merge: true }
        );
      }
    };
  
    if (latestGoal) {
      getStatus();
    }
  }, [isComplete, latestGoal, userLogs]);

  const submitNewGoal = () => {
    if (latestGoal?.status === "Completed" || !latestGoal) {
      submitGoal();
    } else if (latestGoal?.status === "Ongoing") {
      Alert.alert(
        "🎯",
        "You have an ongoing goal. Submitting will overwrite it. Continue?",
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => submitGoal(latestGoal.id) },
        ]
      );
    }
  };

  const submitGoal = async (id?: string) => {
    const autoId = firestore().collection("goals").doc().id;
    await goalsDoc
      .set(
        {
          [id ?? autoId]: {
            id: id ?? autoId,
            target: newTarget,
            start_date: newStartDate,
            end_date: newEndDate,
            status: "Ongoing",
            created_at: new Date(),
          },
        },
        { merge: true }
      )
      .catch((error) => console.error("Error submitting goal:", error));

    toggleEdit();
  };
  
  return (
    <UserGoalContext.Provider
      value={{
        latestGoal,
        editGoal,
        progressImpact,
        progressPercentage,
        isComplete,
        toggleEdit,
        submitNewGoal,
        newStartDate,
        newEndDate,
        newTarget,
        setNewStartDate,
        setNewEndDate,
        setNewTarget,
      }}
    >
      {children}
    </UserGoalContext.Provider>
  );
};

export const useUserGoalContext = () => {
  const context = useContext(UserGoalContext);
  if (!context) {
    throw new Error("useUserGoalContext must be used within a UserGoalProvider");
  }
  return context;
};
