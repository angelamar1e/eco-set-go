import React, { useState } from "react";
import { FlatList } from "react-native";
import { styled } from "nativewind";
import { Text, Layout, Card, useTheme } from "@ui-kitten/components";
import { logList, EcoAction, LogItem } from "./LogsList";
import ToDoButton from "./ToDoButton"; 
import AddActionButton from "./AddActionButton";

const CustomLogs = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState<EcoAction[]>(logList);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const StyledLayout = styled(Layout);
  const StyledText = styled(Text);
  const StyledCard = styled(Card);

  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const filteredTasks = tasks.filter((task) => {
    if (selectedFilter === "To Do") return !task.completed;
    if (selectedFilter === "Done") return task.completed;
    return true; // "All" filter
  });

  const renderEmptyMessage = () => {
    if (selectedFilter === "All") {
      return <StyledText category="p2" style={{ textAlign: 'center', color: '#AAA', marginTop: 5}}>Add Eco Actions</StyledText>;
    } else if (selectedFilter === "To Do") {
      return <StyledText category="p2" style={{ textAlign: 'center', color: '#AAA', marginTop: 5 }}>No pending actions.</StyledText>;
    } else if (selectedFilter === "Done") {
      return <StyledText category="p2" style={{ textAlign: 'center', color: '#AAA', marginTop: 5 }}>No actions completed yet.</StyledText>;
    }
    return null;
  };

  return (
    <StyledCard className="rounded-lg ml-2 mr-2 mb-2">
      <StyledText category="h5" className="text-center mb-2" style={{ color: theme['color-primary-900'] }}>
        Customize your Daily Log
      </StyledText>

      <StyledLayout className="m-1 flex-row justify-between items-center">
        <StyledLayout className="flex-row">
          <ToDoButton 
            selectedFilter={selectedFilter} 
            onFilterChange={handleFilterChange} 
          />
        </StyledLayout>
        <AddActionButton />
      </StyledLayout>

      <StyledLayout>
        {filteredTasks.length === 0 ? (
          renderEmptyMessage()
        ) : (
          <FlatList
            data={filteredTasks}
            renderItem={({ item }) => (
              <LogItem item={item} onToggle={toggleTaskCompletion} onDelete={handleDelete} />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </StyledLayout>
    </StyledCard>
  );
};

export default CustomLogs;
