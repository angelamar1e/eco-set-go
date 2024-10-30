import React, { FC, useContext, useEffect, useState } from "react";
import { View, FlatList, Text, KeyboardAvoidingView } from "react-native";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { ThemedText } from "@/components/ThemedText";
import { EcoAction } from "@/types/EcoAction";
import StaticDone from "./StaticDone";
import { EmissionsContext } from "@/contexts/Emissions";
import {MealDone, Meal, MealData} from './MealAction';
import DropdownActionItem from "./DropdownActionItem";
import Static from './StaticAction';
import Parameterized from "./ParameterizedAction";
import {DrivingActionDone, ReductionRate} from "./ReductionRateAction";
import { DoneTransportAction, TransportationOptions } from "./TransportOptionsAction";
import { Transportation } from "./TransportAction";
import { useUserContext } from "@/contexts/UserContext";

const emissionsContext = useContext(EmissionsContext);

const templates = [Meal, Static, Parameterized, ReductionRate, TransportationOptions, Transportation];
const doneTemplates = [MealDone, StaticDone, StaticDone, DrivingActionDone, DoneTransportAction, DoneTransportAction];

const DailyLog: FC = () => {
  const { userUid } = useUserContext();
  const [dailyLog, setDailyLog] = useState<EcoAction[]>([]);
  const [completedActions, setCompletedActions] = useState<EcoAction[]>([]);
  const [actionIds, setActionIds] = useState<string[]>([]);
  const [currentLog, setCurrentLog] = useState({});
  const [completedActionIds, setCompletedActionIds] = useState<{[key: string]: number}>({});
  const [baseMeal, setBaseMeal] = useState<MealData>();
  const [chosenMeal, setChosenMeal] = useState<MealData>();
  const [vehicleLessEF, setVehicleLessEF] = useState<number>(0);
  const [vehicleHigherEF, setVehicleHigherEF] = useState<number>(0);

  // Handler to update vehicle states for Transportation actions
  const handleMealSelection = (baseMeal: MealData, chosenMeal: MealData) => {
    setBaseMeal(baseMeal);
    setChosenMeal(chosenMeal);
  };

  // Handler to update vehicle states for Transportation actions
  const handleVehicleSelection = (higherEF: number, lessEF: number) => {
    setVehicleHigherEF(higherEF);
    setVehicleLessEF(lessEF);
  };

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

  async function handleComplete(actionId: string, template: number, impact: number) {
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
        updatePayload = impact;
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
        setMealSelection={handleMealSelection} // Pass down the handler
        setSelectedVehicles={handleVehicleSelection}
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
      // <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={400} className="flex-1">
      <View className="bg-gray">
        <ThemedText type="subtitle" className="text-lime-800 text-center text-[28px] mt-2 mb-4">
          Daily Log
        </ThemedText>
        <FlatList
          data={dailyLog}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <Text className="text-lime-800 text-lg font-semibold mt-4 mb-4 pl-4">Actions Done</Text>
        {completedActions.length > 0 ? (
          <FlatList
            data={completedActions}
            renderItem={renderDoneItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text className="text-center text-gray-500">No actions completed yet.</Text>
        )}
      </View>
      // </KeyboardAvoidingView>
    );
};

export default DailyLog;