import React, { FC, useContext, useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { QuestionProps } from '@/types/QuizProps';
import { TransportEmission } from '@/constants/DefaultValues';


const Transportation6: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";

    const {setFootprintPerLiter} = useContext(EmissionsContext);

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation7");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation5")
    };

    return(
        <ThemedView className="px-4">
            <Template3
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.footprintPerLiter}
                onNext={handleNext}
                onBack={handleBack}
                onAnswer={setFootprintPerLiter}
                showBackButton={true}
            />
        </ThemedView>
    )
};

export default Transportation6;
    
