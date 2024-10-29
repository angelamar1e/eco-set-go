import React, { useCallback, useContext } from "react";
import { View } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps, DoneItemProps } from "@/types/ActionItemProps";
import { computeImpact, convertKgToGrams } from '../../../utils/EstimationUtils';
import { EmissionsContext } from '@/contexts/Emissions';
import { EmissionsDataContext } from "@/contexts/EmissionsData";
import { styled } from "nativewind";
import { Card, Layout, Text } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import CircularCheckbox from "../Goal Setting/CircularCheckBox";

const StyledText = styled(Text);
const StyledCard = styled(Card);
const StyledLayout = styled(Layout);

export const Parameterized: React.FC<ActionItemProps> = ({
  item,
  completedActions,
  handleComplete,
  handleDelete,
}) => {

    const { emissionsData } = useContext(EmissionsDataContext);
    let impact = 0;

    function getImpact() {
        const baseEmissions = emissionsData[item.baseEmission!] ?? 0;
        const replacementEmissions = emissionsData[item.impact] ?? item.impact
        console.log(baseEmissions);

        if (item.title === "Carpool"){
          impact = baseEmissions * replacementEmissions;
        }
        else{
          impact = computeImpact(baseEmissions, replacementEmissions);
        }

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
          <StyledText numberOfLines={2} style={{ fontSize: 14, width: "85%",}} className="ml-1">
            {item.title}
          </StyledText>
        </View>
      </StyledCard>
    </StyledLayout>
    </Swipeable>
  );
};

export default Parameterized;
