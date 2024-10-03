import React, { useState } from 'react'; // Add the import for useState
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native-gesture-handler";
import { QuestionContainer } from "../components/quiz/QuestionContainer";
import { ThemedText } from "@/components/ThemedText";
import { RadioChoices } from "../components/quiz/RadioChoices";
import { View } from "react-native";

export const Breakfast = () => {
    const question = "What kind of breakfast do you usually eat?";
    const answers = [
        'Traditional Filipino Breakfast', 
        'Simple Rice Meal', 
        'Dairy and Cereals', 
        'Bread, Jams', 
        'Fruits', 
        'No Breakfast (Beverages, but not solid food)'
    ];
    
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    const handleChoiceSelect = (choiceId: number) => {
        setSelectedChoice(choiceId);
    };

    return (
        <ThemedView>
            <ScrollView>
                <QuestionContainer>
                    <ThemedText type="default">{question}</ThemedText>
                    
                    <View className="flex-wrap flex-row justify-left">
                        {answers.map((answer, index) => (
                            <RadioChoices
                                key={index}
                                title={answer}
                                isSelected={selectedChoice === index}
                                onPress={() => handleChoiceSelect(index)} 
                            />
                        ))}
                    </View>
                </QuestionContainer>
            </ScrollView>
        </ThemedView>
    );
};
