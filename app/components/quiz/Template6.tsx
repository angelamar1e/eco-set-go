import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { QuestionContainer } from './QuestionContainer';
import { SuggestedAnswers } from './SuggestedAnswers';
import { CheckboxChoices } from './Checkbox'; 
import { NavigationButtons } from './NavigationButtons';

interface Template6Props {
  category: string;
  question: string;
  answers: string[]; 
  checkboxes: string[]; 
  onNext: () => void;         
  onBack?: () => void;        
  showBackButton?: boolean;
}

const Template6: FC<Template6Props> = ({
  category,
  question,
  answers,
  checkboxes,
  onNext,
  onBack,
  showBackButton = true,
}) => {

  // State to manage selected suggested answer
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // State to manage the checked status of checkboxes
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Handle suggested answer selection
  const handleAnswerPress = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Handle checkbox toggle
  const handleCheckboxToggle = (item: string) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [item]: !prevCheckedItems[item],
    }));
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
              onPress={() => handleAnswerPress(answer)}
            />
          ))}
        </View>

        {/* Checkboxes */}
        <View className="flex-row flex-wrap justify-center mt-10 mb-3">
          {checkboxes.map((item) => (
            <CheckboxChoices
              key={item}
              title={item}
              isChecked={checkedItems[item] || false}
              onPress={() => handleCheckboxToggle(item)}
            />
          ))}
        </View>

        {/* Navigation Button */}
        <View className='flex-row justify-center mt-4'>
          {showBackButton && (
            <NavigationButtons
              title="Back"
              variant="secondary"
              onPress={onBack}
            />
          )}
            <NavigationButtons
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

export default Template6;
