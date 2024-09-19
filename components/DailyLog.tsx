import React, { FC, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import firestore from "@react-native-firebase/firestore"; // Firestore instance from firebase.js
import {Swipeable } from "react-native-gesture-handler";
import { styled } from "nativewind"; // Nativewind for styling
import { EcoAction } from "../types/EcoAction";
import { getUserUid } from "@/app/utils";
import { EcoArticle } from "@/types/EcoArticle";

const StyledTouchableOpacity = styled(TouchableOpacity);

// Main Component
const DailyLog: FC = () => {
  const [dailyLog, setDailyLog] = useState<EcoArticle[]>([]);
  const [completedActions, setCompletedActions] = useState<EcoArticle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const ecoActions = await getArticleInfo();
        setDailyLog(ecoActions);
        console.log(dailyLog);
      };
  
    fetchData();
  }, [5]);

  async function getUserActions() {
    const userUid = await getUserUid();
    const actionIds: string[] = [];
    const dailyLog = await firestore()
      .collection("daily_logs")
      .doc(userUid)
      .get();

    const data = dailyLog.data();
    if (data && data.action_ids) {
        actionIds.push(...data.action_ids);
    }
  
    console.log(actionIds);
    return actionIds;
  }

  async function getActionDetails() {
    const actionIds = await getUserActions();
    const ecoActions: EcoAction[] = [];

    for (const actionId of actionIds) {
      const ecoActionDoc = await firestore()
        .collection("eco_actions")
        .doc(actionId)
        .get();
      if (ecoActionDoc.exists) {
        ecoActions.push({
          id: ecoActionDoc.id,
          ...ecoActionDoc.data(),
        } as EcoAction); 
      }
    }

    console.log('Fetched Eco Actions:', ecoActions); // Log to check data
    return ecoActions;
  }

  async function getArticleInfo() {
    const actionIds = await getUserActions();
    const ecoArticles: EcoArticle[] = [];

    for (const actionId of actionIds) {
      const ecoArticle = await firestore()
        .collection("eco_articles")
        .doc(actionId)
        .get();
      if (ecoArticle.exists) {
        ecoArticles.push({
          id: ecoArticle.id,
          ...ecoArticle.data(),
        } as EcoArticle); 
      }
    }

    console.log('Fetched Eco Actions:', ecoArticles); // Log to check data
    return ecoArticles;
  }

  // Handle marking task as complete
  const handleComplete = (action: EcoArticle) => {
    setCompletedActions([...completedActions, action]);
    setDailyLog(dailyLog.filter((item) => item.id !== action.id)); // Remove from main list
  };

  // Handle deleting an item from the task list
  const handleDelete = (actionId: string) => {
    setDailyLog(dailyLog.filter((item) => item.id !== actionId));
  };

  // Render function for individual tasks
  const renderItem = ({ item }: { item: EcoArticle }) => (
    <Swipeable
      renderRightActions={() => (
        <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
      )}
    >
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
        <Text className="text-lg">
          {item.title}
        </Text>
        <Checkbox
          status={
            completedActions.some((action) => action.id === item.id)
              ? "checked"
              : "unchecked"
          }
          onPress={() => handleComplete(item)}
        />
      </View>
    </Swipeable>
  );

  if (Object.keys(dailyLog).length === 0){
    return (
      <View>
        <Text className="text-center text-lg">Daily Log</Text>
        <Text className="text-sm">Customize your <Text className="italic">Daily Log!</Text></Text>
      </View>
    )
  }
  else{
    return (
      <View className="">
        <Text className="text-center">Daily Log</Text>
        <FlatList
          data={dailyLog}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
  
        {/* List of Completed Actions */}
        <Text className="text-lg font-semibold mt-4 px-4">Actions Done:</Text>
        {completedActions.length > 0 ? (
          <FlatList
            data={completedActions}
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
                <Text className="text-lg">{item.title}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text className="px-4 text-gray-500">No actions completed yet.</Text>
        )}
  
        {/* Styled link for adding new action */}
        <StyledTouchableOpacity
          className="mt-6 mb-10 mx-4 py-3 bg-green-500 rounded-full"
        >
          <Text className="text-center text-white text-lg font-semibold">Add New Action</Text>
        </StyledTouchableOpacity>
      </View>
    );
  }
};

export default DailyLog;
