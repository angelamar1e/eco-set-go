import React, { useCallback, useContext } from "react";
import { View, Text } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import { computeImpact, convertKgToGrams } from '../../../utils/EstimationUtils';
import { EmissionsDataContext } from "@/contexts/EmissionsData";


const EcoDriving: React.FC<ActionItemProps> = ({
  item,
  completedActions,
  handleComplete,
  handleDelete,
}) => {
  // Get emissions data from the real-time context
  const { emissionsData, loading, error } = useContext(EmissionsDataContext);
  
  // Ensure we handle loading and error states
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  // Destructure emissions data
  const { carEmissions, numOfPassengers } = emissionsData || {};

  // Update impact calculation
  const getImpact = useCallback(() => {
    const baseEmissions = carEmissions ?? 0; // Ensure a fallback value
    const passengers = numOfPassengers ?? 1; // Ensure no division by zero

    console.log("Current Car Emissions:", baseEmissions);
    console.log("Number of Passengers:", passengers);

    // Calculate impact
    const impact = (baseEmissions * 0.15) / passengers;
    handleComplete(item.id, convertKgToGrams(impact));
  }, [carEmissions, numOfPassengers, item.id, handleComplete]); // Ensure dependencies include necessary values

  return (
    <Swipeable
      renderRightActions={() => (
        <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
      )}
    >
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
        <Text className="text-lg text-gray-700">{item.id}</Text>
        <Checkbox
          status={completedActions.some((action) => action.id === item.id) ? "checked" : "unchecked"}
          onPress={() => getImpact()} // Call the updated getImpact function
        />
      </View>
    </Swipeable>
  );
};

export default EcoDriving;
