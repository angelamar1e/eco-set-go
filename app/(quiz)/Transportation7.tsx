import React, { FC, useContext } from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';

const Transportation7: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";
    const textFieldLabel = "liter per km";

    const {setConsumptionPerKm} = useContext(EmissionsContext);

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation8");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation6")
    };

    return (
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.consumptionPerKm}
                inputLabel={textFieldLabel}
                onBack={handleBack}
                onNext={handleNext}
                onAnswer={setConsumptionPerKm}
                showBackButton={true} 
            />
        </ThemedView>
    )
};

export default Transportation7;