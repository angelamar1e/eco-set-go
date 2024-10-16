// TemplateOneItem.tsx
import React from "react";
import { View, Text } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";

const ActionItem: React.FC<ActionItemProps> = ({
  item,
  completedActions,
  handleComplete,
  handleDelete,
}) => {
  return (
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
          onPress={() => handleComplete(item.id, item.impact ? item.impact : 0)}
        />
      </View>
    </Swipeable>
  );
};

export default ActionItem;
