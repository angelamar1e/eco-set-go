import React, { FC, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { styled } from "nativewind";
import { EcoAction } from "@/types/EcoAction";
import { getUserUid } from "@/app/utils/utils";
import moment from "moment";
import { ThemedText } from "@/components/ThemedText";

const StyledTouchableOpacity = styled(TouchableOpacity);

const DailyLog: FC = () => {
  const [userUid, setUserUid] = useState<string | undefined>();
  const [dailyLog, setDailyLog] = useState<EcoAction[]>([]);
  const [completedActions, setCompletedActions] = useState<EcoAction[]>([]);
  const [actionIds, setActionIds] = useState<string[]>([]);
  const [completedActionIds, setCompletedActionIds] = useState<string[]>([]);

  const currentDate = moment().format("MM-DD-yy");

  // Get User ID on Component Mount
  useEffect(() => {
    const fetchUserUid = async () => {
      const uid = await getUserUid();
      setUserUid(uid);
    };

    fetchUserUid();
  }, []);

  // Firestore document references
  const dailyLogDoc = firestore().collection("daily_logs").doc(userUid);
  const userLogs = firestore().collection("user_logs").doc(userUid);

  // Real-time Listener for Action IDs and Completed Action IDs
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

    // Clean up the real-time listeners on unmount
    return () => {
      unsubscribeDailyLog();
      unsubscribeUserLogs();
    };
  }, [userUid]);

  // Fetch EcoAction information based on the Action IDs
  useEffect(() => {
    const fetchEcoActions = async () => {
      if (actionIds.length > 0) {
        const remainingActions = actionIds.filter((id) => !completedActionIds.includes(id));
        const actionsData = await getActionInfo(remainingActions);
        const completedActionsData = await getActionInfo(completedActionIds);

        setDailyLog(actionsData);
        setCompletedActions(completedActionsData);
      }
      else if (actionIds.length == 0){
        setDailyLog([]);
      }
    };

    fetchEcoActions();
  }, [actionIds, completedActionIds]);

  // Helper Function to Fetch Multiple Action Info using a Batch Query
  async function getActionInfo(ids: string[]): Promise<EcoAction[]> {
    if (ids.length === 0) return [];
    
    const actionCollection = firestore().collection("eco_actions");
    const actionQuery = await actionCollection.where(firestore.FieldPath.documentId(), "in", ids).get();

    return actionQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EcoAction[];
  }

  // Handle Marking Task as Complete
  async function handleComplete(actionId: string) {
    await userLogs.update({
      [currentDate]: firestore.FieldValue.arrayUnion(actionId),
    });
  }

  

  // Handle Deleting an Action from Daily Log
  const handleDelete = async (actionId: string) => {
    await dailyLogDoc.update({
      action_ids: firestore.FieldValue.arrayRemove(actionId),
    });
  };

  // Handle Unmarking task
  async function handleUnmark(actionId: string) {
    await userLogs.update({
      [currentDate]: firestore.FieldValue.arrayRemove(actionId),
    });
  }

  // Render Individual EcoAction Items
  const renderItem = ({ item }: { item: EcoAction }) => (
    <Swipeable
      renderRightActions={() => (
        <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
      )}
    >
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
        <Text className="text-lg text-gray-700">{item.title}</Text>
        <Checkbox
          status={
            completedActions.some((action) => action.id === item.id)
              ? "checked"
              : "unchecked"
          }
          onPress={() => handleComplete(item.id)}
        />
      </View>
    </Swipeable>
  );

  return (
    <View className="bg-gray">
      <ThemedText type="subtitle" className="text-lime-800 text-center text-[28px] mt-2 mb-4">Daily Log</ThemedText>
      <FlatList
        data={dailyLog}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* Completed Actions Section */}
      <Text className="text-lime-800 text-lg font-semibold mt-4 mb-4 pl-4">Actions Done</Text>
      {completedActions.length > 0 ? (
        <FlatList
          data={completedActions}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
              <ThemedText className="text-lg text-gray-700">{item.title}</ThemedText>
              <Checkbox
                status={
                  completedActions.some((action) => action.id === item.id)
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => handleUnmark(item.id)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text className="text-center text-gray-500">No actions completed yet.</Text>
      )}
    </View>
  );
};

export default DailyLog;