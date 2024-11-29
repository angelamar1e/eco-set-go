import React, { useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { View, TouchableOpacity, Alert } from "react-native";
import { Checkbox, IconButton, List } from "react-native-paper";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import {
  Card,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import { styled } from "nativewind";
import { ThemedText } from "@/components/ThemedText";
import { EmissionsContext } from "@/contexts/Emissions";
import {
  computeMealEmission,
  convertKgToGrams,
  CustomWeights,
} from "@/app/utils/EstimationUtils";
import { EcoAction } from "@/types/EcoAction";
import {
  FoodItem,
  Meals,
  MeanOneDayConsumption,
  mealBase,
} from "../../../../constants/DefaultValues";
import { computeImpact } from "@/app/utils/EstimationUtils";
import { convertGramsToKg } from "../../../utils/EstimationUtils";
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
const StyledInput = styled(Input);

export interface MealData {
  mealType: string;
  mealBase: string;
  mealEF: number;
}

export const Meal: React.FC<ActionItemProps> = ({
  item,
  handleComplete,
  handleDelete,
}) => {
  const { emissionsData } = useContext(EmissionsContext);
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
      const impact = computeImpact(baseMeal!.mealEF, chosenMeal!.mealEF);
      handleComplete(
        item.id,
        item.template,
        convertKgToGrams(impact),
        baseMeal,
        chosenMeal
      );
    }
  }, [baseMeal, chosenMeal]);

  return (
    <Swipeable
      renderRightActions={() => (
        <View className="flex items-center justify-center ml-2 mr-4">
          <Ionicons
            name="trash"
            size={20}
            color="red"
            onPress={() => handleDelete(item.id)}
          />
        </View>
      )}
    >
      <StyledLayout
        className="pt-1 m-1"
      >
        <StyledSelect
          className="w-full rounded-lg"
          placeholder={() => (
            <StyledText
              numberOfLines={2}
              style={{ width: "85%" }}
              className="text-base leading-5"
            >
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
  const { userUid, loading } = useUserContext();
  const { emissionsData } = useContext(EmissionsContext);
  const [baseMeal, setBaseMeal] = useState<MealData>();
  const [chosenMeal, setChosenMeal] = useState<MealData>();
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleMoreDetails = () => {
    setShowInput(!showInput);
  };

  useEffect(() => {
    // Only add a listener if `userUid` is available
    if (!userUid) return;

    const currentDate = moment().format("YYYY-MM-DD");

    // Set up a Firestore listener for real-time updates
    const unsubscribe = firestore()
      .collection("user_logs")
      .doc(userUid)
      .onSnapshot(
        (doc) => {
          const currentLog = doc.data()?.[currentDate] || {};
          setBaseMeal(currentLog[item.id]?.baseMeal || null);
          setChosenMeal(currentLog[item.id]?.chosenMeal || null);
        },
        (error) => {
          console.error("Error fetching real-time meal data:", error);
        }
      );

    // Cleanup the listener when the component unmounts or userUid changes
    return () => unsubscribe();
  }, [userUid]);

  // Function to calculate maximum replacement quantity
  function getMaxReplacementAmount(baseAmount = 0.15, minReduction = 0.1) {
    // Get the emission factors for the chosen meal and replacement
    const baseEF = MeanOneDayConsumption[baseMeal!.mealBase].efPerKg;
    const replacementEF = MeanOneDayConsumption[chosenMeal!.mealBase].efPerKg;

    // Calculate emissions for the base meal and target reduction
    const baseEmissions = baseEF * baseAmount; // Emissions of the original meal (150 grams by default)
    const targetReduction = baseEmissions - minReduction; // Target emissions after 100 grams reduction

    // Calculate the maximum amount of replacement to meet the reduction goal
    const maxReplacementAmount = targetReduction / replacementEF;

    // Convert to grams for clarity
    return convertKgToGrams(maxReplacementAmount);
  }

  const handleCompleteDetails = async () => {
    const weightInGrams =
      parseFloat(inputValue) <= 0 ? 0.15 : parseFloat(inputValue);
    const additionals = emissionsData["additionals"] || {};
    const maxReplacementAmount = getMaxReplacementAmount();
    console.log(maxReplacementAmount);

    if (weightInGrams > maxReplacementAmount) {
      Alert.alert(
        "Oops 🥘",
        `Looks like you've got a bit too much on your plate! For a more climate-friendly meal, try keeping ${
          chosenMeal?.mealBase === "Cereal Products"
            ? chosenMeal?.mealType
            : chosenMeal?.mealBase
        } under ${maxReplacementAmount.toFixed(0)} grams. 🌎`
      );
    } else {
      const impact = computeImpact(
        baseMeal!.mealEF,
        computeMealEmission(chosenMeal!.mealType, additionals, {
          [chosenMeal!.mealBase]: convertGramsToKg(weightInGrams),
        })
      );

      handleComplete(
        item.id,
        item.template,
        convertKgToGrams(impact),
        baseMeal,
        chosenMeal
      );
      setInputValue("");
      setShowInput(false);
    }
  };

  return (
    <View>
      <StyledLayout
        className="pt-1 m-1"
      >
        <View className="border border-gray-200 rounded-lg">
          <View className="flex-row flex-wrap ml-3 mt-3 items-center justify-start">
            <CircularCheckbox
              status={
                completedActions.some((action) => action.id === item.id)
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => handleUnmark(item.id)}
            />
            <StyledText className="text-base w-10/12 leading-6">
              {item.title}
            </StyledText>
          </View>
          <TouchableOpacity onPress={handleMoreDetails}>
            <StyledText
              category="s1"
              className="ml-12 mt-2 mb-2 font-bold"
              style={{
                color: myTheme['color-success-700'],
              }}
            >
              Enter more details
            </StyledText>
          </TouchableOpacity>
        

        {showInput && (
          <View>
            <StyledLayout className="rounded-xl mb-3 ml-12 flex-row items-center justify-end px-4">
              <StyledText className="text-sm">
                Amount of{" "}
                <Text className="italic">
                  {chosenMeal?.mealBase === "Cereal Products"
                    ? chosenMeal?.mealType
                    : chosenMeal?.mealBase}
                </Text>
                {" "}eaten{": "} 
              </StyledText>
              <StyledInput
                className="w-1/4"
                placeholder=""
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <StyledText category="label" className="ml-2 mr-3 text-sm">
                grams
              </StyledText>
            </StyledLayout>
            <View className="items-center">
              <TouchableOpacity
                className="rounded-lg w-full p-2 px-6 mb-3"
                onPress={handleCompleteDetails}
              >
                <StyledText
                  category="p1"
                  className="text-white text-sm font-bold text-right"
                  style={{color: myTheme['color-success-700']}}
                >
                  → Submit
                </StyledText>
              </TouchableOpacity>
            </View>
          </View>
        )}
        </View>
      </StyledLayout>
    </View>
  );
};
