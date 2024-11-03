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

        handleComplete(item.id, item.template, convertKgToGrams(impact));
    }

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
        <StyledCard className="rounded-lg mb-2 h-12" style={{justifyContent: 'center'}}>
          <View className="flex-row items-center justify-start bottom-1">
              <CircularCheckbox
            status={
              completedActions.some((action) => action.id === item.id)
                ? "checked"
                : "unchecked"
            }
            onPress={() => getImpact()}
          />
            <StyledText category="p1" numberOfLines={2} style={{width: "85%",}} className="text-base w-10/12 leading-6">
              {item.title}
            </StyledText>
        </View>
      </StyledCard>
    </StyledLayout>
    </Swipeable>
  );
};

export default Parameterized;
