import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import { styled } from "nativewind";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";
import { Ionicons } from "@expo/vector-icons";
import { Card, Input, Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

const StyledCard = styled(Card);
const StyledLayout = styled(Layout);
const StyledText = styled(Text);


const DoneItem: React.FC<DoneItemProps> = ({
  item,
  handleComplete,
  completedActions,
  handleUnmark,
  handleDelete,
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
    <Swipeable
      renderRightActions={() => (
        <View className="flex items-center justify-center mr-4 ml-2">
          <Ionicons name="trash" size={20} color="red" onPress={() => handleDelete(item.id)} />
        </View>
      )}
    >
      <StyledLayout 
        style={{
          borderBottomWidth: 1, 
          borderBottomColor: myTheme['color-basic-500']
        }} 
          className="pt-1 m-1"
        >
        <StyledCard className="rounded-lg flex-wrap">
          <View className="flex-row items-center">
              <CircularCheckbox
                status={
                  completedActions.some((action) => action.id === item.id)
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => handleUnmark(item.id)}
              />
              <Text category="p1" style={{ marginLeft: 8 }}>{item.title}</Text>
            </View>
          </StyledCard>

          <TouchableOpacity onPress={handleMoreDetails}>
            <StyledText category="s1" 
              className="ml-4 m-1"
              style={{ 
                color: myTheme['color-info-500']}}
              >
              Enter more details
            </StyledText>
          </TouchableOpacity>

          {showInput && (
          <View>
            <StyledLayout className="rounded-xl mb-2">
              <Input
                className="rounded-xl"
                placeholder="Enter"
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
              />
            </StyledLayout>
            <View className="items-center">
              <TouchableOpacity className="bg-blue-500 rounded-full items-center p-2 w-1/2 mb-2">
                <StyledText category='p1' className="text-white text-sm text-center">Submit</StyledText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </StyledLayout>
    </Swipeable>
  );
};

export default DoneItem;