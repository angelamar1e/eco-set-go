import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { styled } from "nativewind";
import { Text, Layout, Card, Button } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons"; 
import CircularCheckbox from "./CircularCheckBox";
import { Swipeable } from "react-native-gesture-handler"; 

interface EcoAction {
  id: string;
  title: string;
  completed: boolean;
}

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

const LogList = () => {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState<EcoAction[]>([
    { id: "1", title: "Recycle Plastic", completed: false },
    { id: "2", title: "Use Public Transport", completed: true },
    { id: "3", title: "Turn Off Lights", completed: true },
  ]);

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

  const renderItem = ({ item }: { item: EcoAction }) => (
    <Swipeable
      renderRightActions={() => (
        <View className="flex items-center justify-center ml-2">
          <Button
            appearance="outline"
            status="danger"
            onPress={() => handleDelete(item.id)}
            accessoryLeft={() => <Ionicons name="trash" size={15} />}
          >
            Delete
          </Button>
        </View>
      )}
    >
      <StyledLayout className="rounded-lg m-1 p-1">
        <StyledCard>
          <View className="flex-row items-center flex-1">
            <CircularCheckbox
              isChecked={item.completed}
              onPress={() => toggleTaskCompletion(item.id)}
            />
            <StyledText category="p1" style={{ marginLeft: 8 }}>
              {item.title}
            </StyledText>
          </View>
        </StyledCard>
      </StyledLayout>
    </Swipeable>
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
