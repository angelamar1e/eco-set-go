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
      <StyledLayout className="pt-1 m-1">
        <View className="rounded px-3 border border-gray-200 py-2 w-full" style={{justifyContent: 'center', backgroundColor: myTheme['color-basic-200']}}>
          <View className="flex-row items-center justify-start">
              <CircularCheckbox
              status={
                completedActions.some((action) => action.id === item.id)
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => handleComplete(item.id, item.template, item.impact ? item.impact : 0)}
            />
            <StyledText 
              numberOfLines={2} 
              style={{ 
                fontSize: 14,
                width: "85%",
                fontFamily: 'Poppins-Regular',
                top: 5
              }} 
              className="ml-1 mb-2"
            >
              {item.title}
            </StyledText>
          </View>
        </View>
      </StyledLayout>
    </Swipeable>
  );
};

export default Static;
