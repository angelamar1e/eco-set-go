import React, { useState} from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import Template2 from '../components/quiz/Template2';

const Softdrinks = () => {
    

    const category="Drinks";
    const question="How often is your weekly consumption of soft drinks, fruit juice, etc?";
    const answers=[
        'Once a week',
        'Daily',
        'Twice a week',
    ]
    const unit="liters";

    // Set up a default value and a state for the answer
    const [defaultValue, setDefaultValue] = useState<string | number>(answers[0]);  // Assuming first choice is default

    // Handle answer selection
    const handleAnswer = (answer: string | number) => {
        console.log('Selected answer:', answer);
        setDefaultValue(answer);  // Update the default value after user selection
    };

    return (
        <ThemedView className="flex-1 px-4">
            <ScrollView>
                <Template2
                category={category}
                question={question}
                choices={answers}
                unit={unit}
                defaultValue={defaultValue} 
                onAnswer={handleAnswer}
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Softdrinks;
