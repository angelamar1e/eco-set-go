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
import { myTheme } from "@/constants/custom-theme";
import { MealData } from "./MealAction";

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
  completedActions,
}) => {
  const { emissionsData } = useContext(EmissionsDataContext);
  const [isSelectionSet, setIsSelectionSet] = useState(false);
  const [vehicleLessEF, setVehicleLessEF] = useState<number>(0);
  const [vehicleHigherEF, setVehicleHigherEF] = useState<number>(0);
  const kmTravelled = item.defaultKmTravelled!;

  function getImpact() {
    const higherEF = emissionsData[item.impact] ?? item.impact;
    const lessEF = emissionsData[item.baseEmission] ?? item.baseEmission;

    setVehicleHigherEF(higherEF);
    setVehicleLessEF(lessEF);
  }

  useEffect(() => {
    if (vehicleHigherEF || 0 && vehicleLessEF || 0) {
      const higherEmissions = vehicleHigherEF! * kmTravelled;
      const lessEmissions = vehicleLessEF! * kmTravelled;

      let impact = 0;

      if (isBicycle(item.title)){
          impact = higherEmissions;
      }
      else{
          impact = computeImpact(higherEmissions, lessEmissions);
      }
      
      handleComplete(item.id, item.template, convertKgToGrams(impact), ({}) as MealData, ({}) as MealData, vehicleHigherEF, vehicleLessEF);
      setIsSelectionSet(false); // Reset to avoid reruns unless selection changes
    }
  }, [vehicleHigherEF, vehicleLessEF]);

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
        <StyledCard className="rounded-lg mb-2 h-12" style={{justifyContent: 'center',}}>
          <View className="flex-row items-center justify-start bottom-1">
              <CircularCheckbox
              status={
              completedActions.some((action) => action.id === item.id)
                ? "checked"
                : "unchecked"
            }
            onPress={() => getImpact()}
            // onPress={() => handleComplete(item.id, item.impact ? item.impact : 0)}
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