import React, { FC, useContext, useEffect, useState, } from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { TransportEmission } from '@/constants/DefaultValues';
import { QuestionProps } from '@/types/QuizProps';
import { EmissionsContext } from '@/contexts/EmissionsContext';

// Use FC with the props interface
const Transportation1: FC<QuestionProps> = ({ question, choices }) => {
  const {setKmTravelled} = useContext(EmissionsContext);

  const category = 'Transportation';
  const unit = 'km'


  return (
    <ThemedView className="px-4">
      <Template2
        category={category}
        question={question}
        choices={choices}
        unit={unit}
        defaultValue={TransportEmission.Car.kmTravelled}
        onAnswer={setKmTravelled}
      />
    </ThemedView>
  );
};

export default Transportation1;
