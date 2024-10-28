import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import { styled } from "nativewind";
import { ThemedText } from "@/components/ThemedText";

const StaticDone: React.FC<DoneItemProps> = ({
  item,
  completedActions,
  handleUnmark,
}) => {
  return (
      <View className="flex-column">
        <View className="flex-row justify-between items-center px-4 py-3 border-gray-300">
          <ThemedText className="text-lg text-gray-700">
            {item.title}
          </ThemedText>
          <Checkbox
            status={
              completedActions.some((action) => action.id === item.id)
                ? "checked"
                : "unchecked"
            }
            onPress={() => handleUnmark(item.id)}
          />
        </View>
    </View>
  );
};

export default StaticDone;