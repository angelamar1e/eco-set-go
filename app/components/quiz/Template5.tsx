import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { QuestionContainer } from './QuestionContainer';
import { SuggestedAnswers } from './SuggestedAnswers';
import Stepper  from './Stepper'
import { NavigationButton } from './NavigationButtons';

interface Template5Props {
  category: string;
  question: string;
  answers: string[];
  stepperTitle: string;
  stepperInitialValue: number;
  onNext: () => void;         
  onBack?: () => void;        
  showBackButton?: boolean;
}

const Template5: FC<Template5Props> = ({
  category,
  question,
  answers,
  stepperTitle,
  stepperInitialValue,
  onNext,
  onBack,
  showBackButton = true,
}) => {

  // State to manage the selected answer
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // State to manage the stepper value
  const [stepperValue, setStepperValue] = useState<number>(stepperInitialValue);

  // Function to handle answer selection
  const handlePress = (answer: string) => {
    setSelectedAnswer(answer);
  };

  return (
    <ThemedView className="flex-1 px-6">
      <QuestionContainer>
        <ThemedText type='defaultSemiBold' className='text-lime-800 mb-3'>{category}</ThemedText>
        <ThemedText type="default" className="text-black text-[20px] mb-3">{question}</ThemedText>

        {/* Suggested Answers */}
        <View className="flex-row flex-wrap justify-left mb-3">
          {answers.map((answer) => (
            <SuggestedAnswers
              key={answer}
              title={answer}
              isSelected={selectedAnswer === answer}
              onPress={() => handlePress(answer)}
            />
          ))}
        </View>

        {/* Stepper */}
        <View className="mt-5 mb-5 justify-center mt-10 mb-3">
          <Stepper 
            title={stepperTitle}
            value={stepperValue}
            onChange={setStepperValue}
          />
        </View>

        {/* Navigation Button */}
        <View className='flex-row justify-center mt-4'>
          {showBackButton && (
            <NavigationButton
              title="Back"
              variant="secondary"
              onPress={onBack}
            />
          )}
            <NavigationButton
              title="Next"
              variant="primary"
              onPress={() => {
              console.log('Next button pressed');
              onNext();
          }}
            />
        </View>
      </QuestionContainer>
    </ThemedView>
  );
};

export default Template5;
