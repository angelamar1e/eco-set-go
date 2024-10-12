import React, { FC, useContext, useState } from 'react';
import { Template2 } from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { QuestionProps } from '@/types/QuizProps';
import { TransportEmission } from '@/constants/DefaultValues';


const Transportation6: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";

    const {setFootprintPerLiter} = useContext(EmissionsContext);



    return(
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Car.footprintPerLiter}
                onAnswer={setFootprintPerLiter}
                unit=''
            />
        </ThemedView>
    )
};

export default Transportation6;
    
