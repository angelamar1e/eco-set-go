import React, { FC, useContext, useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { QuestionProps } from '@/types/QuizProps';
import { TransportEmission } from '@/constants/DefaultValues';
import { EmissionsContext } from '@/contexts/EmissionsContext';

interface Question3Props{
    question: string,
    choices: Map<string, number>
}

const Transportation4: FC<Question3Props> = ({ question, choices }) => {
    const category = "Transportation";

    const {setLifeSpanInKm} = useContext(EmissionsContext);

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation5");
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation3")
    };

    return(
        <ThemedView className="px-4">
            <Template3
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.lifeSpan}
                onNext={handleNext}
                onBack={handleBack}
                showBackButton={true}
                onAnswer={setLifeSpanInKm}
            />
        </ThemedView>
    )
};

export default Transportation4;
    
