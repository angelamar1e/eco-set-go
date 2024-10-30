import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Checkbox, IconButton, List } from "react-native-paper";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import { Layout, Select, SelectItem } from "@ui-kitten/components";
import { styled } from "nativewind";
import { ThemedText } from "@/components/ThemedText";
import { EmissionsContext } from "@/contexts/Emissions";
import {
  computeMealEmission,
  convertKgToGrams,
  CustomWeights,
} from "@/app/utils/EstimationUtils";
import { EcoAction } from "@/types/EcoAction";
import { FoodItem, Meals, mealBase } from "../../../../constants/DefaultValues";
import { computeImpact } from "@/app/utils/EstimationUtils";
import { convertGramsToKg, getCarEFPerKm } from '../../../utils/EstimationUtils';
import { EmissionsDataContext } from "@/contexts/EmissionsData";

const StyledLayout = styled(Layout);
const StyledSelect = styled(Select);
const StyledSelectItem = styled(SelectItem);

function isBicycle(title: string){
    if (title.startsWith("Use a bicycle")){
        return true;
    }
    else{
        return false;
    }
}

export const Transportation: React.FC<ActionItemProps & {setSelectedVehicles: (higherEF: number, lessEF: number) => void}> = ({
  item,
  handleComplete,
  handleDelete,
  completedActions,
  setSelectedVehicles
}) => {
  const { emissionsData } = useContext(EmissionsDataContext);
  const [isSelectionSet, setIsSelectionSet] = useState(false);
  const [vehicleLessEF, setVehicleLessEF] = useState<number>();
  const [vehicleHigherEF, setVehicleHigherEF] = useState<number>();
  const kmTravelled = item.defaultKmTravelled!;

  function getImpact() {
    console.log("PRESSED");
    const higherEF = emissionsData[item.impact] ?? item.impact;
    const lessEF = emissionsData[item.baseEmission] ?? item.baseEmission;

    setVehicleHigherEF(higherEF);
    setVehicleLessEF(lessEF);
  }

  useEffect(() => {
    if (vehicleHigherEF || 0 && vehicleLessEF || 0) {
      setSelectedVehicles(vehicleHigherEF!, vehicleLessEF!);
      setIsSelectionSet(true); // Update the state to indicate selection is set
      console.log(vehicleHigherEF, vehicleLessEF);
    }
  }, [vehicleHigherEF, vehicleLessEF]);
  
  useEffect(() => {
    if (isSelectionSet) {
      const higherEmissions = vehicleHigherEF! * kmTravelled;
      const lessEmissions = vehicleLessEF! * kmTravelled;

      let impact = 0;

      if (isBicycle(item.title)){
          impact = higherEmissions;
      }
      else{
          impact = computeImpact(higherEmissions, lessEmissions);
      }
      
      handleComplete(item.id, item.template, convertKgToGrams(impact));
      setIsSelectionSet(false); // Reset to avoid reruns unless selection changes
    }
  }, [isSelectionSet]);

  return (
    <Swipeable
      renderRightActions={() => (
        <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
      )}
    >
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
        <Text className="text-lg text-gray-700">{item.title}</Text>
        <Checkbox
            status={
              completedActions.some((action) => action.id === item.id)
                ? "checked"
                : "unchecked"
            }
            onPress={() => getImpact()}
          />
      </View>
    </Swipeable>
  );
};