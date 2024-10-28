import React, { useCallback, useContext } from "react";
import { View, Text } from "react-native";
import { Checkbox, IconButton } from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { ActionItemProps } from "@/types/ActionItemProps";
import { computeImpact, convertKgToGrams } from '../../../utils/EstimationUtils';
import { EmissionsContext } from '@/contexts/Emissions';
import { EmissionsDataContext } from "@/contexts/EmissionsData";

const Parameterized: React.FC<ActionItemProps> = ({
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
        <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
      )}
    >
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-300">
        <Text className="text-lg text-gray-700">{item.title}</Text>
        <Checkbox
          status={
            completedActions.some((action) => action.id === item.id)
              ? "checked"
              : "unchecked"
          }
          onPress={() => getImpact()}
        />
      </View>
    </Swipeable>
  );
};

export default Parameterized;
