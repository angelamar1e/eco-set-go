import React, { FC, useContext } from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';

const Transportation7: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";
    const unit = 'l/km'
    const {setConsumptionPerKm} = useContext(EmissionsContext);


    return (
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.consumptionPerKm}
                unit={unit}
                onAnswer={setConsumptionPerKm}
            />
        </ThemedView>
    )
};

export default Transportation7;