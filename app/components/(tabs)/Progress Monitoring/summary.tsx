import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Entypo } from "@expo/vector-icons"; 
import Figure from "./figure";

const options = [
  { label: "Daily", value: "Daily Progress" },
  { label: "Weekly", value: "Weekly Progress" },
  { label: "Monthly", value: "Monthly Progress" },
  { label: "All Time", value: "All Time Progress" },
];

const SummaryReport = () => {
  const [selectedValue, setSelectedValue] = useState("All Time"); // Default value
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);
  
  const selectOption = (value: string) => {
    setSelectedValue(value);
    setExpanded(false);
  };

  return (
    <View className="bg-white rounded-lg m-2 items-center">
                
        {/* Dropdown button */}
        <TouchableOpacity onPress={toggleExpanded} className="flex-row w-[90%] border-b border-b-stone-100 p-3 mt-2 justify-between z-10">
            <ThemedText type='defaultSemiBold' className="text-lime-800 text-[25px]">{selectedValue}</ThemedText>
            <Entypo name={expanded ? "chevron-down" : "chevron-up"} size={20} color={'#d6d3d1'} />
        </TouchableOpacity>

        {/* Dropdown Options */}
        {expanded && (
            <View className="absolute top-14 bg-white border border-stone-200 rounded-md shadow-md w-[30%] right-7 z-20">
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    onPress={() => selectOption(option.value)}
                    className={`pl-2 pt-1 ${selectedValue === option.value ? 'bg-gray-100' : ''}`}
                >
                    <ThemedText type='default' className="text-gray-500 mb-2">{option.label}</ThemedText>
                </TouchableOpacity>
            ))}
            </View>
        )} 
        <Figure />
    </View>
  );
};

export default SummaryReport;
