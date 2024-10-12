import React, { FC, useContext, useState } from 'react';
import {Template2} from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { TransportEmission } from '@/constants/DefaultValues';
import { EmissionsContext } from '@/contexts/EmissionsContext';

interface QuestionProps{
    question: string,
    choices: Map<string, string>
}

const Transportation3: FC<QuestionProps> = ({ question, choices }) => {
    const { setUser } = useContext(EmissionsContext);

    const category = "Transportation";


    return(
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.user}
                onAnswer={setUser}
                unit=''
            />
        </ThemedView>
    )
};

export default Transportation3;
    
