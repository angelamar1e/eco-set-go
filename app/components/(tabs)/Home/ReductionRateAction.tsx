import React, { useCallback, useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import { computeImpact, convertKgToGrams, getCarEFPerKm } from '../../../utils/EstimationUtils';
import { EmissionsDataContext } from "@/contexts/EmissionsData";
import { ThemedText } from "@/components/ThemedText";
import { DoneItemProps } from '../../../../types/ActionItemProps';


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

    handleComplete(item.id, convertKgToGrams(impact));
  }

  return (
    <Swipeable
      renderRightActions={() => (
        <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
      )}
    >
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
        <Text className="text-lg text-gray-700">{item.title}</Text>
        <Checkbox
          status={completedActions.some((action) => action.id === item.id) ? "checked" : "unchecked"}
          onPress={() => getImpact()} // Call the updated getImpact function
        />
      </View>
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
    
    handleComplete(item.id, convertKgToGrams(impact));
  }

  return (
    <View>
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
        <View className="border-b border-gray-300">
          <TouchableOpacity onPress={handleMoreDetails}>
            <Text className="mx-5 mb-3 text-lime-700">Enter more details</Text>
          </TouchableOpacity>

          {showInput && (
            <View className="mt-2 px-4 flex-row">
              <Text>
                Input distance travelled
              </Text>
              <TextInput
                className="border text-white border-gray-400 rounded p-2 mb-2"
                placeholder=""
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <Text>
                km
              </Text>
              <TouchableOpacity
                className="bg-blue-500 rounded p-2"
                onPress={handleCompleteDetails}
              >
                <Text className="text-white text-center">Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
