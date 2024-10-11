import React, { FC, useContext, useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { QuestionProps } from '@/types/QuizProps';
import { TransportEmission } from '@/constants/DefaultValues';
import { EmissionsContext } from '@/contexts/EmissionsContext';


const Transportation8: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";
    const {setTravelledByPlane} = useContext(EmissionsContext);


    return(
        <ThemedView className="px-4">
            <Template3
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Airplane.travelledByPlane}
                onAnswer={setTravelledByPlane}
                unit=''
            />
        </ThemedView>
    )
};

export default Transportation8;
    
