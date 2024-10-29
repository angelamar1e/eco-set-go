import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Checkbox, IconButton, List } from "react-native-paper";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import { Card, Input, Layout, Select, SelectItem, Text } from "@ui-kitten/components";
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
import { Ionicons } from "@expo/vector-icons";
import { myTheme } from "@/constants/custom-theme";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";

const StyledLayout = styled(Layout);
const StyledSelect = styled(Select);
const StyledSelectItem = styled(SelectItem);
const StyledText = styled(Text);
const StyledCard = styled(Card);

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
        <View className="flex items-center justify-center ml-2 mr-4">
          <Ionicons name="trash" size={20} color="red" onPress={() => handleDelete(item.id)} />
        </View>        
      )}
    >
       <StyledLayout className="pt-1 m-1"
          style={{
            borderBottomWidth: 1, 
            borderBottomColor: myTheme['color-basic-500']
          }} 
        >
          <StyledSelect
            className="w-full rounded-lg mb-2"
            placeholder={() => (
              <StyledText numberOfLines={2} style={{ fontSize: 14, width: "85%" }}>
                {item.title}
              </StyledText>
            )}
          >
          {item.options ? (
              Object.entries(item.options).map(([key, value]) => (
                <StyledSelectItem
                  key={key}
                  title={key}
                  onPress={() => {
                    handleComplete(item.id, value);
                    setExpanded(false); // Collapse the dropdown after selection
                  }}
                />
              ))
            ) : (
              <></>
            )}
          </StyledSelect>
      </StyledLayout>
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
              <TouchableOpacity className="bg-blue-500 rounded-lg items-center w-full p-2 px-3 mb-3">
                <StyledText category='p1' className="text-white text-sm text-center">Submit</StyledText>
              </TouchableOpacity>
            </View>
          </View>
          )}
      </StyledLayout>
    </View>
  );
};
