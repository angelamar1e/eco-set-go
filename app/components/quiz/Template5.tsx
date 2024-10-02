import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { QuestionContainer } from './QuestionContainer';
import { SuggestedAnswers } from './SuggestedAnswers';
import Stepper  from './Stepper'
import { NavigationButton } from './NavigationButton';

interface Template5Props {
  question: string;
  answers: string[];
  stepperTitle: string;
  stepperInitialValue: number;
  navigationButtonTitle: string;
  onNavigationPress: () => void;
}

const Template5: FC<Template5Props> = ({
  question,
  answers,
  stepperTitle,
  stepperInitialValue,
  navigationButtonTitle,
  onNavigationPress,
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
        {/* Display the question */}
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
        <View className="mt-5 mb-5">
          <Stepper 
            title={stepperTitle}
            value={stepperValue}
            onChange={setStepperValue}
          />
        </View>

        {/* Navigation Button */}
        <View className="mt-5 items-center">
          <NavigationButton
            title={navigationButtonTitle}
            variant="primary"
            /*no navigation logic applied*/
          />
        </View>
      </QuestionContainer>
    </ThemedView>
  );
};

export default Template5;
