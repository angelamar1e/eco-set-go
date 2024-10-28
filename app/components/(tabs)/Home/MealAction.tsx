import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
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
import { FoodItem, Meals, MeanOneDayConsumption, mealBase } from "../../../../constants/DefaultValues";
import { computeImpact } from "@/app/utils/EstimationUtils";
import { convertGramsToKg } from '../../../utils/EstimationUtils';
import { EmissionsDataContext } from "@/contexts/EmissionsData";

const StyledLayout = styled(Layout);
const StyledSelect = styled(Select);
const StyledSelectItem = styled(SelectItem);

export interface MealData {
  mealType: string;
  mealBase: string;
  mealEF: number;
}

export const Meal: React.FC<ActionItemProps & {setMealSelection: (base: MealData, chosen: MealData) => void}> = ({
  item,
  handleComplete,
  handleDelete,
  setMealSelection,
}) => {
  // const emissionsData = useContext(EmissionsContext);
  const { emissionsData } = useContext(EmissionsDataContext);
  const [baseMeal, setBaseMeal] = useState<MealData>();
  const [chosenMeal, setChosenMeal] = useState<MealData>();
  const [expanded, setExpanded] = useState(false);

  const toggleDropdown = () => setExpanded(!expanded);

  function getMealBase(mealType: string) {
    return Meals[mealType]?.[0] || undefined;
  }

  function getImpact(chosenMealType: string, chosenMealEF: string) {
    if (item && item.baseMeal) {
      for (const [type, EF] of Object.entries(item.baseMeal)) {
        setBaseMeal({
          mealType: type,
          mealBase: getMealBase(type) || "", // Add fallback in case getMealBase returns undefined
          mealEF: emissionsData[EF] || 0, // Fallback for undefined emissions
        });
      }
    }

    setChosenMeal({
      mealType: chosenMealType,
      mealBase: getMealBase(chosenMealType) || "",
      mealEF: emissionsData[chosenMealEF] || 0, // Fallback for undefined emissions
    });
  }

  useEffect(() => {
    if (chosenMeal && baseMeal){
      const impact = computeImpact(baseMeal!.mealEF, chosenMeal!.mealEF);
      handleComplete(item.id, convertKgToGrams(impact));
      setMealSelection(baseMeal, chosenMeal);
    }
  }, [chosenMeal, baseMeal])

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
                  getImpact(key, value);
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

export const MealDone: React.FC<DoneItemProps & { baseMeal?: MealData; chosenMeal?: MealData }> = ({
  item,
  handleComplete,
  completedActions,
  handleUnmark,
  baseMeal,
  chosenMeal,
}) => {
  const { emissionsData } = useContext(EmissionsDataContext);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleMoreDetails = () => {
    setShowInput(!showInput);
  };

    // Function to calculate maximum replacement quantity
  function getMaxReplacementAmount(baseAmount = 0.15, minReduction = 0.1) {
    // Get the emission factors for the chosen meal and replacement
    const baseEF = MeanOneDayConsumption[baseMeal!.mealBase].efPerKg
    const replacementEF = MeanOneDayConsumption[chosenMeal!.mealBase].efPerKg

    // Calculate emissions for the base meal and target reduction
    const baseEmissions = baseEF * baseAmount;  // Emissions of the original meal (150 grams by default)
    const targetReduction = baseEmissions - minReduction; // Target emissions after 100 grams reduction

    // Calculate the maximum amount of replacement to meet the reduction goal
    const maxReplacementAmount = targetReduction / replacementEF;

    // Convert to grams for clarity
    return convertKgToGrams(maxReplacementAmount);
  }

  const handleCompleteDetails = () => {
    if (!baseMeal || !chosenMeal) return;

    const weightInGrams = parseFloat(inputValue) <= 0 ? 0.15 : parseFloat(inputValue);
    const additionals = emissionsData['foodAdditionals'] || {};
    const maxReplacementAmount = getMaxReplacementAmount();
    console.log(maxReplacementAmount);

    if (weightInGrams > maxReplacementAmount) {
      Alert.alert(
          "Oops 🥘",
          `Looks like you've got a bit too much on your plate! For a more climate-friendly meal, try keeping ${
              chosenMeal?.mealBase === "Cereal Products" ? chosenMeal?.mealType : chosenMeal?.mealBase
          } under ${maxReplacementAmount.toFixed(0)} grams. 🌎`
      );
  }
    else{
      const impact = computeImpact(
        baseMeal.mealEF,
        computeMealEmission(chosenMeal.mealType, additionals, { [chosenMeal.mealBase]: convertGramsToKg(weightInGrams) }), 
      );

      handleComplete(item.id, convertKgToGrams(impact));
      setInputValue("");
      setShowInput(false);
    }
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
                Input amount of {chosenMeal?.mealBase === "Cereal Products" ? chosenMeal?.mealType : chosenMeal?.mealBase} eaten
              </Text>
              <TextInput
                className="border text-white border-gray-400 rounded p-2 mb-2"
                placeholder=""
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <Text>
                grams
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
