import React, { useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
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
import { useUserContext } from "@/contexts/UserContext";
import moment from "moment";
import { MealData } from "./MealAction";

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

export const TransportationOptions: React.FC<ActionItemProps> = ({
  item,
  handleComplete,
  handleDelete,
}) => {
  
  const { emissionsData } = useContext(EmissionsContext);
  const [isSelectionSet, setIsSelectionSet] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [vehicleLessEF, setVehicleLessEF] = useState<number>();
  const [vehicleHigherEF, setVehicleHigherEF] = useState<number>();
  const kmTravelled = item.defaultKmTravelled!;

  const toggleDropdown = () => setExpanded(!expanded);

  function assignEmissionFactors(emissionsData: any, EFPerKm: number, item: EcoAction) {
    // Resolve values with nullish coalescing
    const EFPerKmValue = emissionsData[EFPerKm] ?? EFPerKm;
    const baseEmissionValue = emissionsData[item.baseEmission] ?? item.baseEmission;

    // Compare and assign to higherEF and lessEF
    const higherEF = EFPerKmValue > baseEmissionValue ? EFPerKmValue : baseEmissionValue;
    const lessEF = EFPerKmValue > baseEmissionValue ? baseEmissionValue : EFPerKmValue;

    setVehicleHigherEF(higherEF);
    setVehicleLessEF(lessEF);
  }

  function getImpact(EFPerKm: number) {
    assignEmissionFactors(emissionsData, EFPerKm, item);
  }

  useEffect(() => {
    if (vehicleHigherEF || 0  && vehicleLessEF || 0) {
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
                    getImpact(value);
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

export const DoneTransportAction: React.FC<DoneItemProps> = ({
  item,
  handleComplete,
  completedActions,
  handleUnmark,
}) => {
  const {userUid, loading} = useUserContext();
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [vehicleLessEF, setVehicleLessEF] = useState();
  const [vehicleHigherEF, setVehicleHigherEF] = useState();
  let impact = 0;

  const handleMoreDetails = () => {
    setShowInput(!showInput);
  };

  useEffect(() => {
    // Only fetch data if `userUid` is available
    if (!userUid) return;

    const getVehicleData = async () => {
      try {
        const currentDate = moment().format("YYYY-MM-DD");
        const currentLog = (
          await firestore().collection("user_logs").doc(userUid).get()
        ).data()?.[currentDate] || {};

        setVehicleLessEF(currentLog[item.id]?.vehicleLessEF || null);
        setVehicleHigherEF(currentLog[item.id]?.vehicleHigherEF || null);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    getVehicleData();
  }, [userUid, loading]);

  const handleCompleteDetails = () => {
    const kmTravelled = inputValue ? parseFloat(inputValue) : item.defaultKmTravelled!;

    const higherEmissions = vehicleHigherEF! * kmTravelled;
    const lessEmissions = vehicleLessEF! * kmTravelled;

    if (isBicycle(item.title)){
        impact = higherEmissions;
    }
    else{
        impact = computeImpact(higherEmissions, lessEmissions);
    }

    handleComplete(item.id, item.template, convertKgToGrams(impact), ({}) as MealData, ({}) as MealData, vehicleHigherEF, vehicleLessEF);

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
