import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import MilestoneList from "./MilestonesList";

const Achievements = () => {
    return (
        <ThemedView className="flex items-center px-4"> 
            <View className="flex-row items-center mt-3 p-3 w-full justify-between"> 
                <ThemedText type="title" className="text-gray-500 text-[33px] ml-2 left-[110px]">Level</ThemedText>
                <ThemedText type="title" className="text-green-600 text-[33px] right-[125px]">10</ThemedText>
            </View>

            <View className="flex-row items-center w-full justify-between"> 
                <ThemedText type='defaultSemiBold' className="text-gray-500 left-[20px]">Achieved</ThemedText>
                <Ionicons name="search" size={18} color="#6B7280" style={{ marginRight: 18 }} label='Search' />
            </View>

            <View>
                <MilestoneList />
            </View>
        </ThemedView>
    )
};

export default Achievements;
