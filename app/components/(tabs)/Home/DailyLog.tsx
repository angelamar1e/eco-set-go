import React, { FC, useContext, useEffect, useState } from "react";
import {  FlatList, ScrollView } from "react-native";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { EcoAction } from "@/types/EcoAction";
import StaticDone from "./StaticDone";
import { EmissionsContext } from "@/contexts/Emissions";
import {MealDone, Meal, MealData} from './MealAction';
import Static from './StaticAction';
import Parameterized from "./ParameterizedAction";
import {DrivingActionDone, ReductionRate} from "./ReductionRateAction";
import { DoneTransportAction, TransportationOptions } from "./TransportOptionsAction";
import { Transportation } from "./TransportAction";
import { useUserContext } from "@/contexts/UserContext";
import { Card, Layout, Text, useTheme } from "@ui-kitten/components";
import { styled } from "nativewind";
import AddActionButton from "../Goal Setting/AddActionButton";
import { myTheme } from "@/constants/custom-theme";
import { ActivityIndicator } from "react-native-paper";
import { Points } from "@/constants/Points";
import { useUserGoalContext } from "@/contexts/UserGoalContext";


const templates = [Meal, Static, Parameterized, ReductionRate, TransportationOptions, Transportation];
const doneTemplates = [MealDone, StaticDone, StaticDone, DrivingActionDone, DoneTransportAction, DoneTransportAction];

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledScrollView = styled(ScrollView);


const DailyLog: FC = () => {
  const { userUid, points, redeemablePoints } = useUserContext();
  const [dailyLog, setDailyLog] = useState<EcoAction[]>([]);
  const [completedActions, setCompletedActions] = useState<EcoAction[]>([]);
  const [actionIds, setActionIds] = useState<string[]>([]);
  const [currentLog, setCurrentLog] = useState({});
  const [completedActionIds, setCompletedActionIds] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);
  const {setDailyLogLoading, dailyLogLoading} = useUserGoalContext(); 

  const currentDate = moment().format("YYYY-MM-DD");

  async function getCurrentLog(actionId: string) {
    const currentDate = moment().format("YYYY-MM-DD");

    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    setCurrentLog(currentLog[actionId]);
  }

  useEffect(() => {
    setDailyLogLoading(loading);
  }, [loading]);

  const dailyLogDoc = firestore().collection("daily_logs").doc(userUid);
  const userLogs = firestore().collection("user_logs").doc(userUid);

  useEffect(() => {
    if (!userUid) return;

    const unsubscribeDailyLog = dailyLogDoc.onSnapshot((doc) => {
      const data = doc.data();
      if (data && data.action_ids) {
        setActionIds(data.action_ids);
      }
    });

    const unsubscribeUserLogs = userLogs.onSnapshot((doc) => {
      const data = doc.data();
      if (data && data[currentDate]) {
        setCompletedActionIds(data[currentDate]);
      }
    });

    return () => {
      unsubscribeDailyLog();
      unsubscribeUserLogs();
    };
  }, [userUid]);

  useEffect(() => {
    const fetchEcoActions = async () => {
      setLoading(true);

      if (actionIds.length > 0) {
        const remainingActions = actionIds.filter((id) => !Object.keys(completedActionIds).includes(id));
        const actionsData = await getActionInfo(remainingActions);
        const completedActionsData = await getActionInfo(Object.keys(completedActionIds));

        setDailyLog(actionsData);
        setCompletedActions(completedActionsData);
        setLoading(false);
      } else if (actionIds.length === 0) {
        setDailyLog([]);
      }

      setLoading(false);
    };

    fetchEcoActions();
  }, [actionIds, completedActionIds]);

  async function getActionInfo(ids: string[]): Promise<EcoAction[]> {
    if (ids.length === 0) return [];
    const actionCollection = firestore().collection("eco_actions");
    const actionQuery = await actionCollection.where(firestore.FieldPath.documentId(), "in", ids).get();
    return actionQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EcoAction[];
  }

  const handleDelete = async (actionId: string) => {
    await dailyLogDoc.update({
      action_ids: firestore.FieldValue.arrayRemove(actionId),
    });
  };

  async function handleUnmark(actionId: string) {
    const currentDate = moment().format("YYYY-MM-DD");

    getActionPointsById(actionId, "minus");

    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    // Remove the specific actionId from the map for the current date
    delete currentLog[actionId];

    await userLogs.update({
      [currentDate]: currentLog,
    });
  }

  const getActionPointsById = (actionId: string, method: "add" | "minus") => {
    // Define the points mapping
    const pointsMap = {
      100: Points[100],
      200: Points[200]
    };
  
    // Initialize point variables
    let pointsToAddOrSubtract = 0;
  
    // Check if the actionId is in the Points mapping
    if (pointsMap[100].includes(actionId)) {
      pointsToAddOrSubtract = method === "add" ? 100 : -100;
    } else if (pointsMap[200].includes(actionId)) {
      pointsToAddOrSubtract = method === "add" ? 200 : -200;
    }
  
    // If no valid actionId, no points are changed
    if (pointsToAddOrSubtract === 0) {
      return; // Early exit if no valid points associated with the actionId
    }
  
    // Calculate new points and redeemable points, ensuring no negative values
    const newPoints = Math.max(0, points + pointsToAddOrSubtract);
    const newRedeemablePoints = Math.max(0, redeemablePoints + pointsToAddOrSubtract);
  
    // Update Firestore with the new points and redeemable points
    firestore().collection('users').doc(userUid).set({
      points: newPoints,
      redeemablePoints: newRedeemablePoints
    }, { merge: true });
  };
  
  
  async function handleComplete(actionId: string, template: number, impact: number, baseMeal?: MealData, chosenMeal?: MealData, vehicleHigherEF?: number, vehicleLessEF?: number) {
    const currentDate = moment().format("YYYY-MM-DD");

    getActionPointsById(actionId, "add");

    // Fetch the existing log for the current date
    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    // Define the update payload for each case
    let updatePayload;

    if (template === 0) {
        updatePayload = {
            impact,
            baseMeal,
            chosenMeal
        };
    } else if (template === 1 || template === 2 || template === 3) {
        updatePayload = {   
          impact
        };
    } else if (template === 4 || template === 5) {
        updatePayload = {
            impact,
            vehicleLessEF,
            vehicleHigherEF
        };
    }

    try {
        await userLogs.update({
            [currentDate]: {
                ...currentLog, // Keep existing entries for the date
                [actionId]: updatePayload
            }
        });
    } catch (error) {
        console.error("Error updating Firestore:", error);
    }
}

  // Conditionally render the template based on the `template` field
  const renderItem = ({ item }: { item: EcoAction }) => {
    const ActionItemTemplate = templates[item.template];

    return (
      <ActionItemTemplate
        item={item}
        completedActions={completedActions}
        handleDelete={handleDelete}
        handleComplete={handleComplete}
      />
    );
  };

  const renderDoneItem = ({ item }: { item: EcoAction }) => { 
    const ItemDoneTemplate = doneTemplates[item.template];

    return (
      <ItemDoneTemplate
        item={item}
        completedActions={completedActions}
        handleDelete={handleDelete}
        handleUnmark={handleUnmark}
        handleComplete={handleComplete}
      />
    );
  };

    return (
      //<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={400} className="flex-1">*/}
      // <StyledScrollView className="flex-1" style={{height: "auto"}}>
      <StyledLayout className=" relative">
        <StyledLayout className="pt-1">
        {loading ? ( // Show loading spinner if loading
          <StyledLayout className="mt-6" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color={myTheme['color-success-700']} />
          </StyledLayout>
        ) : (
          <>
            {dailyLog.length > 0 ? (
              <FlatList
                data={dailyLog}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <StyledLayout className="pt-1 m-1"
                style={{
                  borderBottomWidth: 1, 
                  borderBottomColor: myTheme['color-basic-500']
                }} 
              >
                <StyledText 
                  category="p2" 
                  className="mb-2" 
                  style={{ 
                    textAlign: 'center', 
                    color: '#AAA',
                    fontFamily: 'Poppins-Regular'
                  }}
                >
                  No pending actions.
                </StyledText>
              </StyledLayout>            
            )}
        
            <StyledText 
              category="s1" 
              style={{ 
                fontFamily: 'Poppins-SemiBold',
              }} 
              className="mt-3 ml-3"
            >
              Actions Done
            </StyledText>
            {completedActions.length > 0 ? (
              <FlatList
                data={completedActions}
                renderItem={renderDoneItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <StyledLayout className="pt-1 m-1"
                style={{
                  borderBottomWidth: 1, 
                  borderBottomColor: myTheme['color-basic-500']
                }} 
              >
                <StyledText 
                  category="p2" 
                  className="mb-2" 
                  style={{ 
                    textAlign: 'center', 
                    color: '#AAA',
                    fontFamily: 'Poppins-Regular'
                  }}
                >
                  No actions done yet.
                </StyledText>
              </StyledLayout>
            )}
          </>
          )}
        </StyledLayout>
      </StyledLayout>
      // </StyledScrollView>
      //*</KeyboardAvoidingView>*/}
    );
};

export default DailyLog;