import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import { styled } from "nativewind";
import { ThemedText } from "@/components/ThemedText";
import { Card, Layout, Text } from "@ui-kitten/components";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";
import { myTheme } from "@/constants/custom-theme";

const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledLayout = styled(Layout);

const StaticDone: React.FC<DoneItemProps> = ({
  item,
  completedActions,
  handleUnmark,
}) => {
  return (
    <StyledLayout className="pt-1 m-1" >
        <View className="rounded px-3 border border-gray-200 py-2 w-full" style={{justifyContent: 'center', backgroundColor: myTheme['color-basic-100']}}>
          <View className="flex-row items-center justify-start">
            <CircularCheckbox
            status={
              completedActions.some((action) => action.id === item.id)
                ? "checked"
                : "unchecked"
                }
                onPress={() => handleUnmark(item.id)}
              />
            <StyledText
              numberOfLines={2}
              style={{ 
                width: "85%",
                fontFamily: 'Poppins-Regular',
                fontSize: 14
              }}
              className="text-base leading-5"
            >
              {item.title}
            </StyledText>
        </View>
    </View>
    </StyledLayout>
  );
};

export default StaticDone;