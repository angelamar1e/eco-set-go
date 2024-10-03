import React, { useState } from 'react'; 
import { Template3 } from '../components/quiz/Template3';
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const BreakfastMeal = () => {
    const router = useRouter();

    const category = "Meals";
    const question = "What kind of breakfast do you usually eat?";
    const answers = [
        'Traditional Filipino Breakfast', 
        'Simple Rice Meal', 
        'Dairy and Cereals', 
        'Bread, Jams', 
        'Fruits', 
        'No Breakfast\n(Beverages, but not solid food)'
        ];
    const onNext = () => {
        console.log('Next button pressed');
        router.push('/(quiz)/Food2');
        };

    const onBack = () => {
        console.log('Back button pressed');
        router.back(); 
    };

    return (
        <ThemedView className="flex-1 px-4">
            <ScrollView>
                <Template3
                    category={category}
                    question={question}
                    answer={answers}
                    onNext={onNext}
                    onBack={onBack}
                    showBackButton={true}
                />
            </ScrollView>
        </ThemedView>
    );
};

export default BreakfastMeal;