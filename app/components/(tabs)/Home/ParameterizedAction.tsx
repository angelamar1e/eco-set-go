import React, { useCallback, useContext } from "react";
import { View } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import {
  computeImpact,
  convertGramsToKg,
  convertKgToGrams,
} from "../../../utils/EstimationUtils";
import { EmissionsContext } from "@/contexts/Emissions";
import { EmissionsDataContext } from "@/contexts/EmissionsData";
import { styled } from "nativewind";
import { Card, Layout, Text } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";
import { myTheme } from "@/constants/custom-theme";

const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledLayout = styled(Layout);

export const Parameterized: React.FC<ActionItemProps> = ({
  item,
  completedActions,
  handleComplete,
  handleDelete,
}) => {
  const { emissionsData } = useContext(EmissionsContext);
  let impact = 0;
  let baseEmissions;
  let replacementEmissions;

  function getImpact() {
    if (item.baseEmission === "coffeeEmissions") {
      console.log("YES COFFEE");
      if (emissionsData["hotDrinksFrequency"]["Coffee"] > 1) {
      console.log(emissionsData["hotDrinksFrequency"]["Coffee"]);
        impact =
          item.impact * convertGramsToKg((emissionsData["hotDrinksFrequency"]["Coffee"] - 1));
        console.log("IMPACT",impact);
      } else {
        impact = 0;
      }
    } else {
      baseEmissions = emissionsData[item.baseEmission!] ?? 0;
      replacementEmissions = emissionsData[item.impact] ?? item.impact;

      if (item.title === "Carpool") {
        impact = baseEmissions * replacementEmissions;
      } else {
        impact = computeImpact(baseEmissions, replacementEmissions);
      }
    }

    handleComplete(item.id, item.template, convertKgToGrams(impact));
  }

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
      <StyledLayout className="pt-1 m-1 justify-start items-start">
        <View
          className="rounded px-3 border border-gray-200 py-2 w-full"
          style={{
            justifyContent: "center",
            backgroundColor: myTheme["color-basic-200"],
          }}
        >
          <View className="flex-row">
            <CircularCheckbox
              status={
                completedActions.some((action) => action.id === item.id)
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => getImpact()}
            />
            <StyledText
              numberOfLines={2}
              style={{
                width: "85%",
                fontFamily: "Poppins-Regular",
                fontSize: 14,
                top: 8,
              }}
              className="text-base leading-5 pb-3"
            >
              {item.title}
            </StyledText>
          </View>
        </View>
      </StyledLayout>
    </Swipeable>
  );
};

export default Parameterized;
