import { getUserUid } from "@/app/utils/utils";
import React, { useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Text } from "react-native-paper";
import { EmissionsContext, EmissionsProvider } from "@/contexts/EmissionsContext";

const Calculator: React.FC = () => {
  const { overallFootprint } = useContext(EmissionsContext); // Get carEmissions from context

  return (
    <Text className="mt-8 ml-3 text-3xl text-lime-300">
      {overallFootprint.toFixed(2)}
      <Text className="text-lime-300 text-2xl"> tons of CO2e</Text>
    </Text>
  );
};

export default Calculator;