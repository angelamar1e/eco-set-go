// LogsList.tsx
import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler"; 
import CircularCheckbox from "./CircularCheckBox";
import { styled } from "nativewind";
import { Card, Layout, Text } from "@ui-kitten/components";

export interface EcoAction {
  id: string;
  title: string;
  completed: boolean;
}

const StyledCard = styled(Card);
const StyledLayout = styled(Layout);


export const logList: EcoAction[] = [
  { id: "1", title: "Recycle Plastic", completed: false },
  { id: "2", title: "Use Public Transport", completed: true },
  { id: "3", title: "Turn Off Lights", completed: true },
];

// Component to render each eco action item
interface LogItemProps {
  item: EcoAction;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const LogItem: React.FC<LogItemProps> = ({ item, onToggle, onDelete }) => (
  <Swipeable
    renderRightActions={() => (
      <View className="flex items-center justify-center mr-4 ml-2">
          <Ionicons name="trash" size={20} color="red" onPress={() => onDelete(item.id)} />
        </View>    
        )}
      >
      <StyledLayout className="pt-1 m-1">
        <StyledCard className="rounded-lg flex-wrap">
          <View className="flex-row items-center">
            <CircularCheckbox
              isChecked={item.completed}
              onPress={() => onToggle(item.id)}
            />
          <Text category="p1" style={{ marginLeft: 8 }}>{item.title}</Text>
        </View>
      </StyledCard>
    </StyledLayout>
  </Swipeable>
);