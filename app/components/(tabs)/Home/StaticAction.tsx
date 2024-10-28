// TemplateOneItem.tsx
import React from "react";
import { View } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";
import { styled } from "nativewind";
import { Card, Layout, Text } from "@ui-kitten/components";

const StyledLayout = styled(Layout);
const StyledCard = styled(Card);

const Static: React.FC<ActionItemProps> = ({
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

export default Static;
