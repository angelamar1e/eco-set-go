import React, { FC, useContext, useState } from 'react';
import { Template2 } from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';


const Transportation13: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";

    const {setTwoWheelerEFPerKm} = useContext(EmissionsContext);


    return(
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.TwoWheelers.efPerKm}
                onAnswer={setTwoWheelerEFPerKm}
                unit=''
            />
        </ThemedView>
    )
};

export default Transportation13;
    
