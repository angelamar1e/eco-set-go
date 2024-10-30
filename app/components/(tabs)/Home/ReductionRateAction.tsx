import React, { useCallback, useContext, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import { computeImpact, convertKgToGrams, getCarEFPerKm } from '../../../utils/EstimationUtils';
import { EmissionsDataContext } from "@/contexts/EmissionsData";
import { ThemedText } from "@/components/ThemedText";
import { DoneItemProps } from '../../../../types/ActionItemProps';
import { styled } from "nativewind";
import { Card, Input, Layout, Text } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";
import { myTheme } from "@/constants/custom-theme";

const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledLayout = styled(Layout);

export const ReductionRate: React.FC<ActionItemProps> = ({
  item,
  completedActions,
  handleComplete,
  handleDelete,
}) => {
  // Get emissions data from the real-time context
  const { emissionsData} = useContext(EmissionsDataContext);

  // Destructure emissions data
  const { carEmissions, carNumOfPassengers } = emissionsData || {};

  
  // Update impact calculation
  function getImpact() {
    let impact = 0;
    const baseEmissions = carEmissions / 365; // Ensure a fallback value
    const passengers = carNumOfPassengers ?? 1; // Ensure no division by zero
    const reductionRate = item.impact;

    // Calculate impact
    if (item.title === "Carpool"){
      impact = (baseEmissions * reductionRate)
    }
    else{
      impact = (baseEmissions * reductionRate) / passengers;
    }

    handleComplete(item.id, item.template, convertKgToGrams(impact));
  }

  return (
    <Swipeable
      renderRightActions={() => (
        <View className="flex items-center justify-center ml-2 mr-4">
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
       <StyledCard className="rounded-lg mb-2 h-12" style={{justifyContent: 'center',}}>
          <View className="flex-row items-center justify-start bottom-1">
              <CircularCheckbox
            status={
              completedActions.some((action) => action.id === item.id)
                ? "checked"
                : "unchecked"
            }
            onPress={() => getImpact()}
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

export const DrivingActionDone: React.FC<DoneItemProps> = ({
  item,
  completedActions,
  handleComplete,
  handleUnmark
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  let impact = 0;

  const { emissionsData } = useContext(EmissionsDataContext);

  const handleMoreDetails = () => {
    setShowInput(!showInput);
  };

  const handleCompleteDetails = () => {
    const kmTravelled = inputValue ? parseFloat(inputValue) : emissionsData['carKmTravelled'] / 365;
    const baseEmissions = emissionsData['carEFPerKm'] * kmTravelled;
    const reductionRate = item.impact;

    // Calculate impact
    if (item.title === "Carpool"){
      impact = (baseEmissions * reductionRate)
    }
    else{
      impact = (baseEmissions * reductionRate) / emissionsData['carNumOfPassengers'];
    }
    
    handleComplete(item.id, item.template, convertKgToGrams(impact));
  }

  return (
    <View>
      <StyledLayout 
        style={{
          borderBottomWidth: 1, 
          borderBottomColor: myTheme['color-basic-500']
        }} 
          className="pt-1 m-1"
        >
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
              <StyledText category="p1" numberOfLines={2} style={{ fontSize: 15, width: "85%",}} className="ml-1 mb-2">
              {item.title}
            </StyledText>
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
            <StyledLayout className="rounded-xl mb-3 ml-1 flex-row items-center">
              <StyledText className="mr-2">
                Input distance travelled
              </StyledText>
              <Input
                style={{width: "30%"}}
                placeholder=""
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <StyledText category='label' className="ml-2 mr-8 text-sm">
                km
              </StyledText>
            </StyledLayout>
            <View className="items-center">
              <TouchableOpacity className="bg-blue-500 rounded-lg items-center w-full p-2 px-3 mb-3" onPress={handleCompleteDetails}>
                <StyledText category='p1' className="text-white text-sm text-center">Submit</StyledText>
              </TouchableOpacity>
            </View>
          </View>
          )}
      </StyledLayout>
    </View>
  );
};
