import React from "react";
import { View } from "react-native";
import { Card, CheckBox, Layout, Text } from "@ui-kitten/components";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledCard = styled(Card);
const StyledLayout = styled(Layout)

const Static: React.FC<ActionItemProps> = ({
  item,
  completedActions,
  handleComplete,
  handleDelete,
}) => {
  return (
    <Swipeable
      renderRightActions={() => (
        <View className="flex items-center justify-center mr-4 ml-2">
          <Ionicons name="trash" size={20} color="red" onPress={() => handleDelete(item.id)} />
        </View>
      )}
    >
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
        <Text className="text-lg text-gray-700">{item.title}</Text>
        <CheckBox
          status={
            completedActions.some((action) => action.id === item.id)
              ? "checked"
              : "unchecked"
          }
          onPress={() => handleComplete(item.id, item.impact ?? 0)}
        />
      </View>
    </Swipeable>
  );
};

export default Static;
