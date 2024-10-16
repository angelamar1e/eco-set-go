import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import { styled } from "nativewind";
import { ThemedText } from "@/components/ThemedText";

const DoneItem: React.FC<DoneItemProps> = ({
  item,
  handleComplete,
  completedActions,
  handleUnmark,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false); // State to control input visibility

  const handleMoreDetails = () => {
    setShowInput(!showInput); // Show the input when "Enter more details" is clicked
  };

  const handleCompleteDetails = () => {
    const multiplier = inputValue ? parseFloat(inputValue) : 5; // Default to 5 if no input
    setInputValue(''); // Clear the input after submission
    setShowInput(false); // Optionally hide the input after submitting
  };

  return (
    <View>
      <View className="flex-column">
        <View className="flex-row justify-between items-center px-4 py-3 border-gray-300">
        <ThemedText className="text-lg text-gray-700">{item.title}</ThemedText>
        <Checkbox
          status={
            completedActions.some((action) => action.id === item.id)
              ? "checked"
              : "unchecked"
          }
          onPress={() => handleUnmark(item.id)}
        />
        </View>
        <View className="border-b border-gray-300">
                <TouchableOpacity onPress={handleMoreDetails}>
          <Text className="mx-5 mb-3 text-lime-700">Enter more details</Text>
        </TouchableOpacity>

        {showInput && (
        <View className="mt-2 px-4">
          <TextInput
            className="border text-white border-gray-400 rounded p-2 mb-2"
            placeholder="Enter"
            keyboardType="numeric"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <TouchableOpacity className="bg-blue-500 rounded p-2">
            <Text className="text-white text-center">Submit</Text>
          </TouchableOpacity>
        </View>
      )}
        </View>
      </View>
    
     
    </View>
  );
};

export default DoneItem;