import React, { FC, useContext } from 'react';
import { Template1 } from '../components/quiz/Template1';
import { ThemedView } from '@/components/ThemedView';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { QuestionProps } from '@/types/QuizProps';
import { TransportEmission } from '@/constants/DefaultValues';

const Transportation14: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";
    const unit = "km";

    const {setTwoWheelersKmTravelled} = useContext(EmissionsContext);

    return (
        <ThemedView className="px-4">
            <Template1
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.TwoWheelers.kmTravelled}
                onAnswer={setTwoWheelersKmTravelled}
                unit={unit}
            />
        </ThemedView>
    )
};

export default Transportation14;