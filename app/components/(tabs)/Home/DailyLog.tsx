import React, { FC, useContext, useEffect, useState } from "react";
import { View, FlatList, Text, KeyboardAvoidingView } from "react-native";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { EcoAction } from "@/types/EcoAction";
import { getUserUid } from "@/app/utils/utils";
import StaticDone from "./StaticDone";
import { EmissionsContext } from "@/contexts/Emissions";
import {MealDone, Meal, MealData} from './MealAction';
import DropdownActionItem from "./DropdownActionItem";
import Static from './StaticAction';
import Parameterized from "./ParameterizedAction";
import {DrivingActionDone, ReductionRate} from "./ReductionRateAction";
import { DoneTransportAction, TransportationOptions } from "./TransportOptionsAction";
import { Transportation } from "./TransportAction";
import { ThemedText } from "@/components/ThemedText";
import { Layout, useTheme } from "@ui-kitten/components";
import { styled } from "nativewind";

const emissionsContext = useContext(EmissionsContext);

const templates = [Meal, Static, Parameterized, ReductionRate, TransportationOptions, Transportation];
const doneTemplates = [MealDone, StaticDone, StaticDone, DrivingActionDone, DoneTransportAction, DoneTransportAction];

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const DailyLog: FC = () => {
  const [userUid, setUserUid] = useState<string | undefined>();
  const [dailyLog, setDailyLog] = useState<EcoAction[]>([]);
  const [completedActions, setCompletedActions] = useState<EcoAction[]>([]);
  const [actionIds, setActionIds] = useState<string[]>([]);
  const [currentLog, setCurrentLog] = useState({});
  const [completedActionIds, setCompletedActionIds] = useState<{[key: string]: number}>({});
  const [baseMeal, setSelectedBaseMeal] = useState<MealData | undefined>();
  const [chosenMeal, setSelectedChosenMeal] = useState<MealData | undefined>();
  const [vehicleLessEF, setVehicleLessEF] = useState<number>(0);
  const [vehicleHigherEF, setVehicleHigherEF] = useState<number>(0);

  // Handler to update meal states from MealAction
  const handleMealSelection = (base: MealData, chosen: MealData) => {
    setSelectedBaseMeal(base);
    setSelectedChosenMeal(chosen);
  };

  // Handler to update vehicle states for Transportation actions
  const handleVehicleSelection = (lessEF: number, higherEF: number) => {
    setVehicleLessEF(lessEF);
    setVehicleHigherEF(higherEF);
  };

  const currentDate = moment().format("YYYY-MM-DD");

  async function getCurrentLog(actionId: string) {
    const currentDate = moment().format("YYYY-MM-DD");
    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};
    setCurrentLog(currentLog[actionId]);
  }

  useEffect(() => {
    const fetchUserUid = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
    };
    fetchUserUid();
  }, []);

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

    delete currentLog[actionId];

    await userLogs.update({
      [currentDate]: currentLog,
    });
  }

  async function handleComplete(actionId: string, impact: number) {
    const currentDate = moment().format("YYYY-MM-DD");

    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    await userLogs.update({
      [currentDate]: {
        ...currentLog, // Keep the existing entries for the date
        [actionId]: impact, // Update the specific action
      },
    });
  }

  const theme = useTheme();
  const headertextColor = theme['color-primary-900'];

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
        baseMeal={baseMeal}
        chosenMeal={chosenMeal}
        lessEF={vehicleLessEF}
        higherEF={vehicleHigherEF}
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
