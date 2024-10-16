import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons"; // Icons for options button

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

  // State to track which task's dropdown is open
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Function to toggle the completion status of a task
  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Function to handle the action button click
  const toggleDropdown = (id: string) => {
    setSelectedTaskId((prevId: string | null) => (prevId === id ? null : id));
  };

  // Function to close the dropdown
  const closeDropdown = () => {
    setSelectedTaskId(null);
  };

  // Render individual task items with checkboxes and options button
  const renderItem = ({ item }: { item: EcoAction }) => (
    <View className="flex-row justify-between bg-stone-100 w-[92%] p-2.5 mb-2 ml-4 rounded-lg items-center z-20">
      <Checkbox
        status={item.completed ? "checked" : "unchecked"}
        onPress={() => toggleTaskCompletion(item.id)}
        color="#4caf50"
        uncheckedColor="#ccc"
      />
      <Text className="text-lg text-black flex-1 ml-1">{item.title}</Text>
    
      {/* Options Button */}
      <TouchableOpacity onPress={() => toggleDropdown(item.id)}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#ccc" right={10} />
      </TouchableOpacity>

      {/* Options Menu */}
      {selectedTaskId === item.id && (
          <View style={{ 
            position: 'absolute', 
            right: 20, 
            backgroundColor: '#fff', 
            borderRadius: 8, 
            elevation: 5, 
            zIndex: 999, 
          }}>
            <TouchableOpacity
              onPress={() => {
                console.log("View Action:", item.title);
                closeDropdown();
              }}
              style={{ padding: 10}}
            >
              <Text>View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                console.log("Delete Action:", item.title);
                setTasks(tasks.filter(task => task.id !== item.id));
                closeDropdown();
              }}
              style={{ padding: 10 }}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
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
