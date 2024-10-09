import React, { FC, useContext } from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';

const Transportation10: FC<QuestionProps> = ({ question, choices }) => {
    const category = "Transportation";
    const textFieldLabel2 = "hrs";

    const {setMediumHaul} = useContext(EmissionsContext);

    const updateFlightDuration = (newDuration: string | number) => {
        setMediumHaul((prevShortHaul: any) => ({
          ...prevShortHaul, // Spread the previous state to keep other properties unchanged
          flightDuration: newDuration, // Update only the flightDuration
        }));
      };

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation11");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation9")
    };

    return (
        <ThemedView className="px-4">
            <Template2
                category={category}
                question={question}
                choices={choices}
                defaultValue={TransportEmission.Airplane.mediumHaul.duration}
                textFieldLabel={textFieldLabel2}
                onBack={handleBack}
                onNext={handleNext}
                onAnswer={updateFlightDuration}
                showBackButton={true}
            />
        </ThemedView>
    )
};

export default Transportation10;