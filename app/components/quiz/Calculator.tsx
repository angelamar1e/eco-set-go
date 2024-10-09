import { getUserUid } from "@/app/utils/utils";
import React, { useContext, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Text } from "react-native-paper";
import { EmissionsContext, EmissionsProvider } from "@/contexts/EmissionsContext";

const Calculator: React.FC = () => {
  const { carEmissions } = useContext(EmissionsContext); // Get carEmissions from context

  useEffect(() => {
    console.log("Calculator: carEmissions updated to", carEmissions);
  }, [carEmissions]);

  return (
    <Text className="mt-8 ml-3 text-3xl text-lime-800">
      {carEmissions}{" "}
      <Text className="text-lime-800 text-2xl">tons of CO2e</Text>
    </Text>
  );
};

export default Calculator;
