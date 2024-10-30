import React, { useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { View, TouchableOpacity, Alert } from "react-native";
import { Checkbox, IconButton, List } from "react-native-paper";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import { Card, Input, Layout, Select, SelectItem, Text, } from "@ui-kitten/components";
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
import { Ionicons } from "@expo/vector-icons";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";
import { myTheme } from "@/constants/custom-theme";
import { useUserContext } from "@/contexts/UserContext";
import moment from "moment";

const StyledLayout = styled(Layout);
const StyledSelect = styled(Select);
const StyledSelectItem = styled(SelectItem);
const StyledText = styled(Text);
const StyledCard = styled(Card);


export interface MealData {
  mealType: string;
  mealBase: string;
  mealEF: number;
}

export const Meal: React.FC<ActionItemProps & { setMealSelection: (baseMeal: MealData, chosenMeal: MealData) => void }> = ({
  item,
  handleComplete,
  handleDelete,
  setMealSelection,
}) => {
  const { emissionsData } = useContext(EmissionsDataContext);
  const [isSelectionSet, setIsSelectionSet] = useState(false);
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
    if (baseMeal && chosenMeal) {
      setMealSelection(baseMeal, chosenMeal);
      setIsSelectionSet(true); // Update the state to indicate selection is set
    }
  }, [baseMeal, chosenMeal]);
  
  useEffect(() => {
    if (isSelectionSet) {
      const impact = computeImpact(baseMeal!.mealEF, chosenMeal!.mealEF);
      handleComplete(item.id, item.template, convertKgToGrams(impact));
      setIsSelectionSet(false); // Reset to avoid reruns unless selection changes
    }
  }, [isSelectionSet]);

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
        }} >
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
                    getImpact(key, value);
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

export const MealDone: React.FC<DoneItemProps> = ({
  item,
  handleComplete,
  completedActions,
  handleUnmark,
}) => {
  const {userUid, loading} = useUserContext();
  const { emissionsData } = useContext(EmissionsDataContext);
  const [baseMeal, setBaseMeal] = useState<MealData>()
  const [chosenMeal, setChosenMeal] = useState<MealData>()
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleMoreDetails = () => {
    setShowInput(!showInput);
  };

  useEffect(() => {
    // Only fetch data if `userUid` is available
    if (!userUid) return;

    const getMealData = async () => {
      try {
        const currentDate = moment().format("YYYY-MM-DD");
        const currentLog = (
          await firestore().collection("user_logs").doc(userUid).get()
        ).data()?.[currentDate] || {};

        setBaseMeal(currentLog[item.id]?.baseMeal || null);
        setChosenMeal(currentLog[item.id]?.chosenMeal || null);
      } catch (error) {
        console.error("Error fetching meal data:", error);
      }
    };

    getMealData();
  }, [userUid, loading]);

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

  const handleCompleteDetails = async () => {
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
        baseMeal!.mealEF,
        computeMealEmission(chosenMeal!.mealType, additionals, { [chosenMeal!.mealBase]: convertGramsToKg(weightInGrams) }), 
      );

      handleComplete(item.id, item.template, convertKgToGrams(impact), chosenMeal, baseMeal);
      setInputValue("");
      setShowInput(false);
    }
  };

  return (
    <View>
      <StyledLayout className="pt-1 m-1" 
        style={{
          borderBottomWidth: 1, 
          borderBottomColor: myTheme['color-basic-500']
        }} >
        <StyledCard className="rounded-lg mb-2 h-12" style={{justifyContent: 'center'}}>
          <View className="flex-row items-center justify-start bottom-1">
              <CircularCheckbox
              status={
                completedActions.some((action) => action.id === item.id)
                  ? "checked"
                  : "unchecked"
                }
                onPress={() => handleUnmark(item.id)}
              />
            <StyledText category="p1" numberOfLines={2} style={{ fontSize: 15, width: "85%",}} className="ml-1 mb-1 bottom-1">
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
                Input amount of <Text className="italic">{chosenMeal?.mealBase === "Cereal Products" ? chosenMeal?.mealType : chosenMeal?.mealBase}</Text>eaten
              </StyledText>
              <Input
                style={{width: "30%"}}
                placeholder=""
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <StyledText category='label' className="ml-2 mr-8 text-sm">
                grams
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
