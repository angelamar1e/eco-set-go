import React, { useContext, useEffect, useState, FC } from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { EmissionsContext } from '@/contexts/EmissionsContext';
import { TransportEmission } from '@/constants/DefaultValues';
import { QuestionProps } from '@/types/QuizProps';

// Use FC with the props interface
const Transportation1: FC<QuestionProps> = ({ question, choices }) => {
  const { setKmTravelled } = useContext(EmissionsContext);

  const category = 'Transportation';
  const textFieldLabel = 'km/year';

  const handleNext = () => {
    console.log('Next button pressed');
    router.push('/(quiz)/Transportation2');
  };

  return (
    <ThemedView className="px-4">
      <Template2
        category={category}
        question={question}
        choices={choices}
        inputLabel={textFieldLabel}
        defaultValue={TransportEmission.Car.kmTravelled}
        onNext={handleNext}
        showBackButton={false}
        onAnswer={setKmTravelled}
      />
    </ThemedView>
  );
};

export default Transportation1;
