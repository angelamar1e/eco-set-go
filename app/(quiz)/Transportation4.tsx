import React, { FC, useContext, useState } from 'react';
import { Template2 } from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
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


    return(
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.lifeSpan}
                onAnswer={setLifeSpanInKm}
                unit=''
            />
        </ThemedView>
    )
};

export default Transportation4;
    
