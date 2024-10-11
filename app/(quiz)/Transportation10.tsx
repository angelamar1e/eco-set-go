import React, { FC, useContext } from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';

const Transportation10: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";
    const unit = "hrs";

    const {setMediumHaul} = useContext(EmissionsContext);

    const updateFlightDuration = (newDuration: string | number) => {
        setMediumHaul((prevShortHaul: any) => ({
          ...prevShortHaul, // Spread the previous state to keep other properties unchanged
          flightDuration: newDuration, // Update only the flightDuration
        }));
      };

    return (
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Airplane.mediumHaul.duration}
                onAnswer={updateFlightDuration}
                unit={unit}
            />
        </ThemedView>
    )
};

export default Transportation10;