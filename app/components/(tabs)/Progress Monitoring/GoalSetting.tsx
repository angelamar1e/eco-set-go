import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { View } from "react-native";
import { styled } from "nativewind";
import {
  Text,
  Layout,
  useTheme,
  Card,
  Datepicker,
  Input,
  ProgressBar,
} from "@ui-kitten/components";
import {} from "react-native-paper";
import { useUserContext } from "@/contexts/UserContext";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import { myTheme } from "@/constants/custom-theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useLogsContext } from "@/contexts/UserLogs";
import { UserLogs, Log } from "@/types/UserLogs";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledProgressBar = styled(ProgressBar);
const StyledInput = styled(Input);

type GoalData = {
  target: number;
  start_date: FirebaseFirestoreTypes.Timestamp; // Firestore Timestamp type
  end_date: FirebaseFirestoreTypes.Timestamp;
  status: string;
  updated_at: FirebaseFirestoreTypes.Timestamp;
};

const GoalSetting: React.FC = () => {
  const theme = useTheme();
  const { userUid } = useUserContext();
  const { userLogs } = useLogsContext();

  const subtextColor1 = theme["color-basic-200"];
  const headertextColor = theme["color-success-900"];

  const [latestGoal, setLatestGoal] = useState<GoalData | null>(null);
  const [editGoal, setEditGoal] = useState(false);
  const [newStartDate, setNewStartDate] = useState<Date>(new Date());
  const [newEndDate, setNewEndDate] = useState<Date>(new Date());
  const [newTarget, setNewTarget] = useState<number>(0);
  const autoId = firestore().collection("_").doc().id;
  const [isComplete, setIsComplete] = useState(false);
  const [progressImpact, setProgressImpact] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("goals")
      .doc(userUid)
      .onSnapshot(
        (goalRecord) => {
          console.log(userUid);
          if (!goalRecord.exists) {
            setLatestGoal(null); // Document does not exist, clear goal
            return;
          }

          // Retrieve goals data and confirm it’s in the expected structure
          const goalsData = goalRecord.data();
          if (!goalsData) {
            setLatestGoal(null); // No goals data, clear goal
            return;
          }

          // Convert Firestore data to array and calculate closest goal
          const goalsArray = Object.values(goalsData) as GoalData[];
          const today = new Date().getTime();

          const closestGoal = goalsArray.reduce(
            (closest: GoalData | null, goal) => {
              // Convert Firestore Timestamps to JavaScript Date objects
              const goalStartDate = goal.start_date.toDate().getTime();
              const closestStartDate = closest
                ? closest.start_date.toDate().getTime()
                : null;

              // Calculate differences from today
              const goalDiff = Math.abs(goalStartDate - today);
              const closestDiff = closestStartDate
                ? Math.abs(closestStartDate - today)
                : Infinity;

              return goalDiff < closestDiff ? goal : closest;
            },
            null
          );

          setLatestGoal(closestGoal);
        },
        (error) => {
          console.error("Error listening for goal updates:", error);
        }
      );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [userUid]);

  const calculateDaysLeft = (
    start: FirebaseFirestoreTypes.Timestamp,
    end: FirebaseFirestoreTypes.Timestamp
  ) => {
    const startDate = start.toDate().getTime();
    const endDate = end.toDate().getTime();
    const diffInMs = endDate - startDate;
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert ms to days and round up
  };

  const toggleEdit = () => {
    setEditGoal(!editGoal);
  };

  const submitNewGoal = () => {
    let shouldMerge = false;
    if (latestGoal?.status === "Complete") {
      shouldMerge = true;
    }

    firestore()
      .collection("goals")
      .doc(userUid)
      .set(
        {
          [autoId]: {
            target: newTarget,
            start_date: newStartDate,
            end_date: newEndDate,
            status: "Incomplete",
            updated_at: new Date(),
          },
        },
        { merge: shouldMerge }
      );
  };

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

  useEffect(() => {
    const getProgressImpact = () => {
      console.log(userLogs);

      if (!latestGoal) return;

    const { stringStartDate, stringEndDate } = convertTimestampToString(
      latestGoal.start_date,
      latestGoal.end_date
    );

    let totalImpact = 0;

    // Collect dates that fall within the specified range
    for (const [date, actions] of Object.entries(userLogs as UserLogs)) {
      if (date >= stringStartDate && date <= stringEndDate) {
        // Iterate through each action for the valid date
        for (const actionKey in actions) {
          const logEntry = actions[actionKey];

          // If logEntry has an 'impact' field, add it to totalImpact
          if (typeof logEntry.impact === 'number') {
            totalImpact += logEntry.impact;
          }
        }
      }
    }

    setIsComplete(totalImpact >= (latestGoal.target ?? 0));
    setProgressImpact(totalImpact);
    };

    getProgressImpact();
  }, [userLogs, latestGoal]);

  

  return (
    <View className="items-center -mt-14 -bottom-3 mb-4 z-50 justify-items-center">
      <StyledCard
        className="bg-white border-0"
        style={{ borderRadius: 20, padding: 0, width: "90%", elevation: 2 }}
      >
        <StyledLayout className="ml-2 mr-2 relative bg-white">
          <View className="flex-row justify-between">
            <StyledText
              className="mb-1 text-lg"
              style={{ color: headertextColor, fontFamily: "Poppins-SemiBold" }}
            >
              Your Goal
            </StyledText>
            <TouchableOpacity
              style={{ backgroundColor: headertextColor }}
              className="bg-lime-400 h-8 w-8 items-center justify-center rounded-3xl"
              onPress={toggleEdit}
            >
              <Ionicons name="pencil" size={18} color={subtextColor1} />
            </TouchableOpacity>
          </View>

          {latestGoal && !editGoal ? (
            <>
              <View>
                <View className="mb-6">
                  <StyledText className="text-gray-600">
                    🟢 Started on{" "}
                    <StyledText className="italic text-gray-600">
                      {latestGoal.start_date
                        .toDate()
                        .toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                    </StyledText>
                  </StyledText>
                  <StyledText className="text-gray-600">
                    🟠{" "}
                    {calculateDaysLeft(
                      latestGoal.start_date,
                      latestGoal.end_date
                    )}{" "}
                    days left
                  </StyledText>
                  <StyledText className="text-gray-600">
                    🔴 To be completed by{" "}
                    <StyledText className="italic text-gray-600">
                      {latestGoal.end_date
                        .toDate()
                        .toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                    </StyledText>
                  </StyledText>
                </View>
                <StyledProgressBar
                  progress={progressPercentage}
                  className="w-11/12 justify-center"
                />
              </View>
              <View className="flex-row justify-between">
                <StyledText className="text-lime-500">200g</StyledText>
                <StyledText className="text-lime-500">
                  {latestGoal.target}g
                </StyledText>
              </View>
            </>
          ) : (
            <></>
          )}

          {editGoal && (
            <>
              <View>
                <View className="mb-6">
                  <View className="flex-row items-center justify-between">
                    <Datepicker
                      label={"Start Date"}
                      date={newStartDate}
                      min={new Date()}
                      onSelect={(newDate) => setNewStartDate(newDate)}
                    />
                    <StyledText className="text-gray-500 mt-4">
                      {"  "}→{"  "}
                    </StyledText>
                    <Datepicker
                      label={"End Date"}
                      date={newEndDate}
                      min={newStartDate}
                      onSelect={(newDate) => setNewEndDate(newDate)}
                    />
                  </View>
                  <View>
                    <StyledInput
                      className="w-1/3"
                      status="basic"
                      label={"Target"}
                      caption={"in grams"}
                      size="small"
                      keyboardType="numeric"
                      onChangeText={(newTarget) =>
                        setNewTarget(parseFloat(newTarget))
                      }
                    />
                  </View>
                </View>
              </View>
              <View className="flex-row justify-end">
                <TouchableOpacity onPress={submitNewGoal}>
                  <StyledText className="text-lime-400">🎯 Submit</StyledText>
                </TouchableOpacity>
              </View>
            </>
          )}
        </StyledLayout>
      </StyledCard>
    </View>
  );
};

export default GoalSetting;
