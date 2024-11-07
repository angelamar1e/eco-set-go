import React, { FC, useContext, useEffect, useState } from "react";
import {  FlatList } from "react-native";
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


const templates = [Meal, Static, Parameterized, ReductionRate, TransportationOptions, Transportation];
const doneTemplates = [MealDone, StaticDone, StaticDone, DrivingActionDone, DoneTransportAction, DoneTransportAction];

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);


const DailyLog: FC = () => {
  const { userUid } = useUserContext();
  const [dailyLog, setDailyLog] = useState<EcoAction[]>([]);
  const [completedActions, setCompletedActions] = useState<EcoAction[]>([]);
  const [actionIds, setActionIds] = useState<string[]>([]);
  const [currentLog, setCurrentLog] = useState({});
  const [completedActionIds, setCompletedActionIds] = useState<{[key: string]: number}>({});

  const currentDate = moment().format("YYYY-MM-DD");

  async function getCurrentLog(actionId: string) {
    const currentDate = moment().format("YYYY-MM-DD");

    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    setCurrentLog(currentLog[actionId]);
  }

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
      if (actionIds.length > 0) {
        const remainingActions = actionIds.filter((id) => !Object.keys(completedActionIds).includes(id));
        const actionsData = await getActionInfo(remainingActions);
        const completedActionsData = await getActionInfo(Object.keys(completedActionIds));

        setDailyLog(actionsData);
        setCompletedActions(completedActionsData);
      } else if (actionIds.length === 0) {
        setDailyLog([]);
      }
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

    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    // Remove the specific actionId from the map for the current date
    delete currentLog[actionId];

    await userLogs.update({
      [currentDate]: currentLog,
    });
  }

  async function handleComplete(actionId: string, template: number, impact: number, baseMeal?: MealData, chosenMeal?: MealData, vehicleHigherEF?: number, vehicleLessEF?: number) {
    const currentDate = moment().format("YYYY-MM-DD");

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
        console.log(`Successfully updated Firestore with actionId: ${actionId}`, updatePayload);
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
      <StyledLayout className=" relative">
        <StyledLayout className="pt-1">
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
                <StyledText category="p2" className="mb-2" style={{ textAlign: 'center', color: '#AAA' }}>No pending actions.</StyledText>
              </StyledLayout>            
            )}
        
            <StyledText category="s1" style={{ fontWeight: 'bold', }} className="mt-1 ml-3">
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
                <StyledText category="p2" className="mb-2" style={{ textAlign: 'center', color: '#AAA' }}>No actions done yet.</StyledText>
              </StyledLayout>
            )}
        </StyledLayout>
      </StyledLayout>
      //*</KeyboardAvoidingView>*/}
    );
};

export default DailyLog;