import React, { FC, useContext, useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { QuestionProps } from '@/types/QuizProps';
import { TransportEmission } from '@/constants/DefaultValues';
import { EmissionsContext } from '@/contexts/EmissionsContext';

const Transportation5: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";

    const {setConstructionScale} = useContext(EmissionsContext);


    return(
        <ThemedView className="px-4">
            <Template3
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.constructionScale}
                onAnswer={setConstructionScale}
                unit=''
            />
        </ThemedView>
    )
};

export default Transportation5;
    
