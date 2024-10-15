import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Checkbox } from "react-native-paper";

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
  ]);

  // Function to toggle the completion status of a task
  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Render individual task items with checkboxes
  const renderItem = ({ item }: { item: EcoAction }) => (
    <View className="flex-row justify-between bg-stone-100 w-[91%] p-4 mb-2 ml-4 rounded-lg">
        <Checkbox
            status={item.completed ? "checked" : "unchecked"}
            onPress={() => toggleTaskCompletion(item.id)} 
            color="#4caf50"
            uncheckedColor="#ccc"
        />
        <Text className="text-lg text-black flex-1 ml-1 mt-1.5">{item.title}</Text>
    </View>
  );

  return (
    <View className="items-center">
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default LogList;
