import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Swipeable } from "react-native-gesture-handler"; 
import { IconButton } from "react-native-paper"; 
import CircularCheckbox from "./CircularCheckBox";

interface EcoAction {
  id: string;
  title: string;
  completed: boolean;
}

const LogList = () => {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState<EcoAction[]>([
    { id: "1", title: "Recycle Plastic", completed: false },
    { id: "2", title: "Use Public Transport", completed: true },
    { id: "3", title: "Turn Off Lights", completed: true },
    { id: "", title: "Turn Off Lights", completed: true },
  ]);

  // State to track completed actions
  const [completedActions, setCompletedActions] = useState<EcoAction[]>([]);

  // Function to toggle task completion
  const handleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    // Update the completed actions state
    setCompletedActions((prevCompleted) => {
      const isCompleted = prevCompleted.some((action) => action.id === id);
      return isCompleted
        ? prevCompleted.filter((action) => action.id !== id) // Remove from completed
        : [...prevCompleted, tasks.find((task) => task.id === id)!]; // Add to completed
    });
  };

  // Function to handle item deletion
  const handleDelete = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setCompletedActions((prevCompleted) =>
      prevCompleted.filter((action) => action.id !== id)
    );
  };

  // Render Individual EcoAction Items
  const renderItem = ({ item }: { item: EcoAction }) => (
  <View className="flex items-center">
    <View className="border border-stone-300 p-2 mb-2 rounded-[25px] w-[92%]">
      <Swipeable
        renderRightActions={() => (
          <View className="flex items-center justify-center">
            <IconButton
              icon="delete"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-lg text-gray-700 ml-3">{item.title}</Text>

          <CircularCheckbox
            isChecked={completedActions.some((action) => action.id === item.id)}  // Circular Checkbox
            onPress={() => handleComplete(item.id)}
          />
        </View>
      </Swipeable>
    </View>
  </View>
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default LogList;
