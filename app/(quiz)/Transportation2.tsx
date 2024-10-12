import React, { FC, useContext, useEffect, useState } from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';
import { Text } from 'react-native-paper';

const Transportation2: FC<QuestionProps> = ({ question, choices }) => {
    const { setNumOfPassengers } = useContext(EmissionsContext);

    console.log();

    const category = "Transporation";
    const textFieldLabel = "persons";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation3");
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation1")
    };

    return (
        <ThemedView className='px-4'>
            <Template2
                category={category}
                question={question}
                choices={choices}
                inputLabel={textFieldLabel}
                defaultValue={TransportEmission.Car.numOfPassengers}
                onNext={handleNext}
                onBack={handleBack}
                showBackButton={true}
                onAnswer={setNumOfPassengers}
            />
        </ThemedView>
    )
};

export default Transportation2;