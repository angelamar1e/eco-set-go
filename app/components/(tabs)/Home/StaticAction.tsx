import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";
import { styled } from "nativewind";
import { Card, Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledCard = styled(Card);
const StyledText = styled(Text);

const Static: React.FC<ActionItemProps> = ({
  item,
  completedActions,
  handleComplete,
  handleDelete,
}) => {
  return (
    <Swipeable
      renderRightActions={() => (
        <View className="flex items-center justify-center ml-2 mr-4">
          <Ionicons name="trash" size={20} color="red" onPress={() => handleDelete(item.id)} />
        </View>
      )}
    >
      <StyledLayout className="pt-1 m-1" 
        style={{
          borderBottomWidth: 1, 
          borderBottomColor: myTheme['color-basic-500']
        }} >
        <StyledCard className="rounded-lg mb-2 h-12" style={{justifyContent: 'center',}}>
          <View className="flex-row items-center justify-start bottom-1">
              <CircularCheckbox
              status={
                completedActions.some((action) => action.id === item.id)
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => handleComplete(item.id, item.template, item.impact ? item.impact : 0)}
            />
            <StyledText category="p1" numberOfLines={2} style={{ fontSize: 15, width: "85%",}} className="ml-1 mb-2">
              {item.title}
            </StyledText>
          </View>
        </StyledCard>
      </StyledLayout>
    </Swipeable>
  );
};

export default Static;
