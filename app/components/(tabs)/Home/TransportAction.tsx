import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Checkbox, IconButton, List } from "react-native-paper";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import { Card, Layout, Select, SelectItem, Text } from "@ui-kitten/components";
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
import CircularCheckbox from "../Goal Setting/CircularCheckBox";

const StyledLayout = styled(Layout);
const StyledCard = styled(Card);
const StyledText = styled(Text);

function isBicycle(title: string){
    if (title.startsWith("Use a bicycle")){
        return true;
    }
    else{
        return false;
    }
}

export const Transportation: React.FC<ActionItemProps> = ({
  item,
  handleComplete,
  handleDelete,
  completedActions
}) => {
  const { emissionsData } = useContext(EmissionsDataContext);
  const [expanded, setExpanded] = useState(false);

  const toggleDropdown = () => setExpanded(!expanded);

  function getImpact() {
    const higherEF = emissionsData[item.impact] ?? item.impact;
    const lessEF = emissionsData[item.baseEmission] ?? item.baseEmission;
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

    handleComplete(item.id, convertKgToGrams(impact));
  }

  return (
      <Swipeable
      renderRightActions={() => (
        <View className="flex items-center justify-center ml-2 mr-4">
          <Ionicons name="trash" size={20} color="red" onPress={() => handleDelete(item.id)} />
        </View>       )}
    >
      <StyledLayout className="pt-1 m-1">
        <StyledCard className="rounded-lg flex-wrap">
          <View className="flex-row items-center">
            <CircularCheckbox
              status={
              completedActions.some((action) => action.id === item.id)
                ? "checked"
                : "unchecked"
            }
            // onPress={() => getImpact()}
            onPress={() => handleComplete(item.id, item.impact ? item.impact : 0)}
          />
          <Text category="p1" style={{ marginLeft: 8 }}>{item.title}</Text>
        </View>
        </StyledCard>
      </StyledLayout>
    </Swipeable>
  );
};