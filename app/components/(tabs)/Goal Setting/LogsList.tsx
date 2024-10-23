import React, { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Text, Layout, CheckBox } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons"; // Icons for options button

interface EcoAction {
  id: string;
  title: string;
  completed: boolean;
}

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

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
    <StyledLayout className="flex-row justify-between w-[92%] p-2.5 mb-2 ml-4 rounded-lg items-center z-20">
      <CheckBox
        checked={item.completed}
        onChange={() => toggleTaskCompletion(item.id)}
        style={{ borderColor: "#4caf50" }}
      >
        <StyledText category='p1'>{item.title}</StyledText>
      </CheckBox>

      {/* Options Button */}
      <TouchableOpacity onPress={() => toggleDropdown(item.id)}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#ccc" />
      </TouchableOpacity>

      {/* Options Menu */}
      {selectedTaskId === item.id && (
        <StyledLayout
          className="absolute right-5 bg-white rounded-lg shadow-lg z-50"
        >
          <TouchableOpacity
            onPress={() => {
              console.log("View Action:", item.title);
              closeDropdown();
            }}
            className="p-2"
          >
            <StyledText category='p1'>View</StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log("Delete Action:", item.title);
              setTasks(tasks.filter((task) => task.id !== item.id));
              closeDropdown();
            }}
            className="p-2"
          >
             <StyledText category='p1'>Delete</StyledText>
          </TouchableOpacity>
        </StyledLayout>
      )}
    </StyledLayout>
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
