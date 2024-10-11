import React, { FC, useContext, useEffect, useState } from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';

const Transportation2: FC<QuestionProps> = ({ question, choices }) => {
    const { setNumOfPassengers } = useContext(EmissionsContext);

    console.log();

    const category = "Transporation";
    const unit = 'persons'

    return (
        <ThemedView className='px-4'>
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.numOfPassengers}
                onAnswer={setNumOfPassengers}
                unit={unit}
            />
        </ThemedView>
    )
};

export default Transportation2;