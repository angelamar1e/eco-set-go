import React, { FC, useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import { ThemedText } from "@/components/ThemedText";
import { EcoAction } from "@/types/EcoAction";
import { getUserUid } from "@/app/utils/utils";

import { Checkbox } from "react-native-paper";
import DropdownEcoAction from './DropdownActionItem';
import ActionItem from './ActionItem';
import DoneItem from "./DoneItem";

const templates = [DropdownEcoAction, ActionItem];
const doneTemplates = [DoneItem];

const DailyLog: FC = () => {
  const [userUid, setUserUid] = useState<string | undefined>();
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

    // Remove the specific actionId from the map for the current date
    delete currentLog[actionId];

    await userLogs.update({
      [currentDate]: currentLog,
    });
  }

  async function handleComplete(actionId: string, selectedOptionValue: number) {
    const currentDate = moment().format("YYYY-MM-DD");

    // Fetch the existing log for the current date
    const currentLog = (await userLogs.get()).data()?.[currentDate] || {};

    // Update the specific actionId within the current date without overwriting other fields
    await userLogs.update({
      [currentDate]: {
        ...currentLog, // Keep the existing entries for the date
        [actionId]: selectedOptionValue, // Update the specific action
      },
    });
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
    const DoneItemTemplate = doneTemplates[item.template];

    return (
      <DoneItemTemplate 
        item={item}
        completedActions={completedActions}
        handleDelete={handleDelete}
        handleUnmark={handleUnmark}
        handleComplete={handleComplete}
      />
    );
  };

  return (
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
  );
};

export default DailyLog;
