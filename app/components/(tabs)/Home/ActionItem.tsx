import React from "react";
import { View } from "react-native";
import { Card, Layout, Text } from "@ui-kitten/components";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledCard = styled(Card);
const StyledLayout = styled(Layout)

const ActionItem: React.FC<ActionItemProps> = ({
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
      <StyledLayout className="pt-1 m-1">
        <StyledCard className="rounded-lg flex-wrap">
          <View className="flex-row items-center">
            <CircularCheckbox
              status={
                completedActions.some((action) => action.id === item.id)
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => handleComplete(item.id, item.impact ? item.impact : 0)}
            />
            <Text category="p1" style={{ marginLeft: 8 }}>{item.title}</Text>
          </View>
        </StyledCard>
      </StyledLayout>
    </Swipeable>
  );
};

export default ActionItem;
