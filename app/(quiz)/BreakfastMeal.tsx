import React, { useState } from 'react'; 
import { Template3 } from '../components/quiz/Template3';
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";

const BreakfastMeal = () => {
    const category = "Food";
    const question = "What kind of breakfast do you usually eat?";
    const answers = [
        'Traditional Filipino Breakfast', 
        'Simple Rice Meal', 
        'Dairy and Cereals', 
        'Bread, Jams', 
        'Fruits', 
        'No Breakfast\n(Beverages, but not solid food)'
    ];

    return (
        <ThemedView className="flex-1 px-4">
            <ScrollView>
            </ScrollView>
        </ThemedView>
    );
};

export default BreakfastMeal;