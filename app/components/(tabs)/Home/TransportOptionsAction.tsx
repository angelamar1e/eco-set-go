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

export const TransportationOptions: React.FC<ActionItemProps & {setSelectedVehicles: (lessEF: number, higherEF: number) => void}> = ({
  item,
  handleComplete,
  handleDelete,
  setSelectedVehicles
}) => {
  const { emissionsData } = useContext(EmissionsDataContext);
  const [expanded, setExpanded] = useState(false);

  const toggleDropdown = () => setExpanded(!expanded);

  function assignEmissionFactors(emissionsData: any, EFPerKm: number, item: EcoAction) {
    // Resolve values with nullish coalescing
    const EFPerKmValue = emissionsData[EFPerKm] ?? EFPerKm;
    const baseEmissionValue = emissionsData[item.baseEmission] ?? item.baseEmission;

    // Compare and assign to higherEF and lessEF
    const higherEF = EFPerKmValue > baseEmissionValue ? EFPerKmValue : baseEmissionValue;
    const lessEF = EFPerKmValue > baseEmissionValue ? baseEmissionValue : EFPerKmValue;

    return { higherEF, lessEF };
}

  function getImpact(EFPerKm: number) {
    const { higherEF, lessEF } = assignEmissionFactors(emissionsData, EFPerKm, item);
    const kmTravelled = item.defaultKmTravelled!;

    const higherEmissions = higherEF * kmTravelled;
    const lessEmissions = lessEF * kmTravelled;
    let impact = 0;

    if (isBicycle(item.title)){
        impact = higherEmissions;
    }
    else{
        impact = computeImpact(higherEmissions, lessEmissions);
    }
    
    setSelectedVehicles(lessEF, higherEF);
    handleComplete(item.id, convertKgToGrams(impact));
  }

  return (
    <Swipeable
      renderRightActions={() => (
        <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
      )}
    >
      <View className="flex-row justify-between items-center px-2 py-3 border-b border-gray-300">
        <StyledSelect className="w-full" placeholder={item.title}>
          {item.options ? (
            Object.entries(item.options).map(([key, value]) => (
              <StyledSelectItem
                key={key}
                title={key}
                onPress={() => {
                  getImpact(value);
                  setExpanded(false); // Collapse the dropdown after selection
                }}
              />
            ))
          ) : (
            <></>
          )}
        </StyledSelect>
      </View>
    </Swipeable>
  );
};

export const DoneTransportAction: React.FC<DoneItemProps & {lessEF: number, higherEF: number}> = ({
  item,
  handleComplete,
  completedActions,
  handleUnmark,
  lessEF,
  higherEF
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  let impact = 0;

  const handleMoreDetails = () => {
    setShowInput(!showInput);
  };

  const handleCompleteDetails = () => {
    const kmTravelled = inputValue ? parseFloat(inputValue) : item.defaultKmTravelled!;

    const higherEmissions = higherEF * kmTravelled;
    const lessEmissions = lessEF * kmTravelled;

    if (isBicycle(item.title)){
        impact = higherEmissions;
    }
    else{
        impact = computeImpact(higherEmissions, lessEmissions);
    }

    handleComplete(item.id, convertKgToGrams(impact));

    setInputValue("");
    setShowInput(false);
  };

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
