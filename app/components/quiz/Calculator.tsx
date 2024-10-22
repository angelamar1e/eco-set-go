import { getUserUid } from "@/app/utils/utils";
import React, { useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Text } from "react-native-paper";
import { EmissionsContext, EmissionsProvider } from "@/contexts/EmissionsContext";
import { ThemedText } from "@/components/ThemedText";

const Calculator: React.FC = () => {
  const { overallFootprint } = useContext(EmissionsContext); // Get carEmissions from context

  return (
    <ThemedText type='defaultSemiBold' className="pt-6 text-5xl text-lime-500">
      {overallFootprint.toFixed(2)}
      <ThemedText type='default' className="text-stone-500 text-3sm"> tons{"\n"}   of CO2e per year
      </ThemedText>
    </ThemedText>
  );
};

export default Calculator;