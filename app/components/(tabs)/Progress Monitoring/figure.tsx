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
    <View className="bg-white flex-row relative justify-between px-4 mt-5 left-2 mb-3">
      {/* Initial Footprint Card */}
      <Box className="flex-grow w-[45%] items-center rounded-[20px] bg-transparent border-2 border-stone-300 px-2 py-10 mr-2">
        <ThemedText type="defaultSemiBold" className=" text-[20px] text-center text-black mb-3">Carbon Footprint</ThemedText>
        <ThemedText type="defaultSemiBold" className="text-center text-[35px] text-black mt-1 pt-2">{initialFootprint} kg</ThemedText>
        <ThemedText type="default" className="text-[15px] text-center text-black mt-4 mb-2 italic">Initial Estimation</ThemedText>
      </Box>

      {/* Current Footprint Card */}
      <Box className="w-[45%] items-center rounded-[20px] items-center px-2 py-10 mr-2">
        <ThemedText type="defaultSemiBold" className="text-stone-300 text-[20px] text-center mb-3">Carbon Footprint</ThemedText>
        <ThemedText type="defaultSemiBold" className="text-center text-[35px] text-stone-300 mt-1 pt-2">{currentFootprint} kg</ThemedText>
        <ThemedText type="default" className="text-stone-300 text-[15px] text-center mt-4 mb-2 italic">Current Estimation</ThemedText>
      </Box>
    </View>
  );
};

export default Figure;
