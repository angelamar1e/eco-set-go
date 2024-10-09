import React, { FC, useContext, useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { TransportEmission } from '@/constants/DefaultValues';
import { EmissionsContext } from '@/contexts/EmissionsContext';

interface Question3Props{
    question: string,
    choices: Map<string, string>
}

const Transportation3: FC<Question3Props> = ({ question, choices }) => {
    const { setUser } = useContext(EmissionsContext);

    const category = "Transportation";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation4");
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation2")
    };

    return(
        <ThemedView className='flex-1 px-4'>
            <Template3
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.user}
                onNext={handleNext}
                onBack={handleBack}
                showBackButton={true}
                onAnswer={setUser}
            />
        </ThemedView>
    )
};

export default Transportation3;
    
