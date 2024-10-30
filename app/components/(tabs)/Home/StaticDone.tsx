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
                onPress={() => handleUnmark(item.id)}
              />
          <StyledText numberOfLines={2} style={{ fontSize: 14, width: "85%",}} className="ml-1 mb-2">
            {item.title}
          </StyledText>
        </View>
    </StyledCard>
    </StyledLayout>
  );
};

export default StaticDone;