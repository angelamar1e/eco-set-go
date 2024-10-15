import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { styled } from "nativewind";
import React from "react";
import { View } from "react-native";

const Figure = () => {
  const initialFootprint = 120; // Example initial value in kg CO2
  const currentFootprint = 85;  // Example current value in kg CO2

  const StyledView = styled(View);

  const Box = ({ className = "", ...props }) => (
    <StyledView
      className={`flex-1 justify-center bg-lime-800 rounded ${className}`}
      {...props}
    />
  );

  return (
    <ThemedView className="flex-row relative px-4 mt-5 left-2">
      {/* Initial Footprint Card */}
      <Box className="w-[45%] h-[75%] items-center rounded-[20px] bg-transparent border-2 border-stone-300 mr-3">
        <ThemedText type="defaultSemiBold" className=" text-[20px] text-center bottom-3">Carbon Footprint</ThemedText>
        <ThemedText type="defaultSemiBold" className="text-center text-[25px] text-lime-800 top-1">{initialFootprint} kg</ThemedText>
        <ThemedText type="default" className="text-[15px] text-center top-4 mb-2 italic">Initial Estimation</ThemedText>
      </Box>

      {/* Current Footprint Card */}
      <Box className="w-[45%] h-[75%] items-center rounded-[20px] mr-3 items-center">
        <ThemedText type="defaultSemiBold" className="text-stone-300 text-[20px] text-center bottom-3">Carbon Footprint</ThemedText>
        <ThemedText type="defaultSemiBold" className="text-center text-[25px] text-stone-300 top-1">{currentFootprint} kg</ThemedText>
        <ThemedText type="default" className="text-stone-300 text-[15px] text-center top-4 mb-2 italic">Current Estimation</ThemedText>
      </Box>
    </ThemedView>
  );
};

export default Figure;
