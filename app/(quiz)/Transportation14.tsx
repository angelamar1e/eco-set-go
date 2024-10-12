import React, { FC, useContext } from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { QuestionProps } from '@/types/QuizProps';
import { TransportEmission } from '@/constants/DefaultValues';

const Transportation14: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";
    const textFieldLabel2 = "km";

    const {setTwoWheelersKmTravelled} = useContext(EmissionsContext);

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation15");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation13")
    };

    return (
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.TwoWheelers.kmTravelled}
                inputLabel={textFieldLabel2}
                onBack={handleBack}
                onNext={handleNext}
                onAnswer={setTwoWheelersKmTravelled}
                showBackButton={true} 
            />
        </ThemedView>
    )
};

export default Transportation14;