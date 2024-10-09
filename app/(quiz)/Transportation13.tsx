import React, { FC, useContext, useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';


const Transportation13: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";

    const {setTwoWheelerEFPerKm} = useContext(EmissionsContext);

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation14");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation12")
    };

    return(
        <ThemedView className="px-4">
            <Template3
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.TwoWheelers.efPerKm}
                onNext={handleNext}
                onBack={handleBack}
                onAnswer={setTwoWheelerEFPerKm}
                showBackButton={true}
            />
        </ThemedView>
    )
};

export default Transportation13;
    
