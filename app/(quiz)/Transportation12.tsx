import React, { FC, useContext, useState } from 'react';
import { Template2 } from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';


const Transportation12: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";
    
    const {setUsesTwoWheelers} = useContext(EmissionsContext);



    return(
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.TwoWheelers.kmTravelled}
                onAnswer={setUsesTwoWheelers}
                unit=''
            />
        </ThemedView>
    )
};

export default Transportation12;
    
