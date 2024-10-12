import React, { useState } from 'react'; 
import { Template2 } from '../components/quiz/Template2';
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native-gesture-handler";

const BreakfastMeal = () => {
    

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

    // Set up a temporary default value and a state for the answer
    const [defaultValue, setDefaultValue] = useState<string | number>(answers[0]);  // Assuming first choice is default

    // Handle answer selection
    const handleAnswer = (answer: string | number) => {
        console.log('Selected answer:', answer);
        setDefaultValue(answer);  // Update the default value after user selection
    };

    return (
        <ThemedView className="px-4">
            <ScrollView>
                <Template2
                    category={category}
                    question={question}
                    choices={answers}
                    defaultValue={defaultValue}   
                    onAnswer={handleAnswer}
                    unit=''
                />
            </ScrollView>
        </ThemedView>
    );
};

export default BreakfastMeal;