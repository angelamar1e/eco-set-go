import React, { useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
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
import { useUserContext } from "@/contexts/UserContext";
import moment from "moment";

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

export const TransportationOptions: React.FC<ActionItemProps & {setSelectedVehicles: (higherEF: number, lessEF: number) => void}> = ({
  item,
  handleComplete,
  handleDelete,
  setSelectedVehicles
}) => {
  
  const { emissionsData } = useContext(EmissionsDataContext);
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
      setSelectedVehicles(vehicleHigherEF!, vehicleLessEF!);
      setIsSelectionSet(true); // Update the state to indicate selection is set
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

    handleComplete(item.id, item.template, convertKgToGrams(impact));

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
