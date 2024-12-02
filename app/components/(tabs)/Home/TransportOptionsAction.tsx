import React, { useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { View, TouchableOpacity } from "react-native";
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
import { FoodItem, Meals, mealBase } from "../../../../constants/DefaultValues";
import { computeImpact } from "@/app/utils/EstimationUtils";
import {
  convertGramsToKg,
  getCarEFPerKm,
} from "../../../utils/EstimationUtils";
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
const StyledInput = styled(Input);


function isBicycle(title: string) {
  if (title.startsWith("Use a bicycle")) {
    return true;
  } else {
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

  function assignEmissionFactors(
    emissionsData: any,
    EFPerKm: number,
    item: EcoAction
  ) {
    // Resolve values with nullish coalescing
    const EFPerKmValue = emissionsData[EFPerKm] ?? EFPerKm;
    const baseEmissionValue =
      emissionsData[item.baseEmission] ?? item.baseEmission;

    // Compare and assign to higherEF and lessEF
    const higherEF =
      EFPerKmValue > baseEmissionValue ? EFPerKmValue : baseEmissionValue;
    const lessEF =
      EFPerKmValue > baseEmissionValue ? baseEmissionValue : EFPerKmValue;

    setVehicleHigherEF(higherEF);
    setVehicleLessEF(lessEF);
  }

  function getImpact(EFPerKm: number) {
    assignEmissionFactors(emissionsData, EFPerKm, item);
  }

  useEffect(() => {
    if (vehicleHigherEF || (0 && vehicleLessEF) || 0) {
      const higherEmissions = vehicleHigherEF! * kmTravelled;
      const lessEmissions = vehicleLessEF! * kmTravelled;

      let impact = 0;

      if (isBicycle(item.title)) {
        impact = higherEmissions;
      } else {
        impact = computeImpact(higherEmissions, lessEmissions);
      }

      handleComplete(
        item.id,
        item.template,
        convertKgToGrams(impact),
        {} as MealData,
        {} as MealData,
        vehicleHigherEF,
        vehicleLessEF
      );
    }
  }, [vehicleHigherEF, vehicleLessEF]);

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
       <StyledLayout className="pt-1 m-1"
        >
        <StyledSelect
          className="w-full rounded-lg"
          placeholder={() => (
            <StyledText
              numberOfLines={2}
              style={{ 
                width: "85%",
                fontFamily: 'Poppins-Regular',
                fontSize: 14
              }}
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
                  title={props => (
                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 14}}>{key}</Text>
                  )}
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
  const { userUid, loading } = useUserContext();
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
        const currentLog =
          (
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
    const kmTravelled = inputValue
      ? parseFloat(inputValue)
      : item.defaultKmTravelled!;

    const higherEmissions = vehicleHigherEF! * kmTravelled;
    const lessEmissions = vehicleLessEF! * kmTravelled;

    if (isBicycle(item.title)) {
      impact = higherEmissions;
    } else {
      impact = computeImpact(higherEmissions, lessEmissions);
    }

    handleComplete(
      item.id,
      item.template,
      convertKgToGrams(impact),
      {} as MealData,
      {} as MealData,
      vehicleHigherEF,
      vehicleLessEF
    );

    setInputValue("");
    setShowInput(false);
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
            <StyledText 
              className="text-base w-10/12 leading-6"
              style={{ 
                fontFamily: 'Poppins-Regular',
                fontSize: 14 
              }}
            >
              {item.title}
            </StyledText>
          </View>

          <TouchableOpacity onPress={handleMoreDetails}>
          <StyledText
              category="s1"
              className="ml-12 mt-2 mb-2"
              style={{
                color: myTheme['color-success-700'],
                fontFamily: 'Poppins-Medium',
                fontSize: 14
              }}
            >
              Enter more details
            </StyledText>
        </TouchableOpacity>

        {showInput && (
          <View>
            <StyledLayout className="rounded-xl mb-3 ml-12 flex-row items-center justify-end px-4">
              <StyledText 
                className="mr-2 text-sm"
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                Distance travelled:
              </StyledText>
              <StyledInput
                className="w-1/4"
                placeholder=""
                keyboardType="numeric"
                value={inputValue}
                onChangeText={setInputValue}
              />
              <StyledText 
                className="ml-2 mr-8 text-sm"
                style={{ fontFamily: 'Poppins-Medium', fontSize: 14 }}
              >
                km
              </StyledText>
            </StyledLayout>
            <View className="items-center">
            <TouchableOpacity
                className="rounded-lg w-full p-2 px-6 mb-3"
                onPress={handleCompleteDetails}
              >
                <StyledText
                  category="p1"
                  className="text-white text-sm text-right"
                  style={{
                    color: myTheme['color-success-700'],
                    fontFamily: 'Poppins-SemiBold'
                  }}
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
