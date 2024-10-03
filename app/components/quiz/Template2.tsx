import React, { FC,useState} from 'react';
import { View} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { QuestionContainer } from './QuestionContainer';
import { SuggestedAnswers } from './SuggestedAnswers';
import { TextField } from './TextField';
import { NavigationButton } from './NavigationButtons';

interface Template2Props {
    category: string;
    question: string;
    answers: string[];
    textFieldLabel: string;
    onNext: () => void;         
    onBack?: () => void;        
    showBackButton?: boolean;  
  }

export const Template2: FC<Template2Props> = ({
    category,
    question,
    answers,
    textFieldLabel,
    onNext,
    onBack,
    showBackButton = true, 
}) => {
 
    // State to manage selected answer
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // State to manage the input value in the TextField
  const [inputValue, setInputValue] = useState<string>("");

  // Function to handle answer selection
  const handlePress = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Function to handle text input change
  const handleTextChange = (text: string) => {
    setInputValue(text);
    };

    return (
      <ThemedView className="flex-1 px-6">
        <QuestionContainer>
            <ThemedText type='defaultSemiBold' className='text-lime-800 mb-3'>{category}</ThemedText>
            <ThemedText type="default" className='text-black text-[20px] mb-3'>{question}</ThemedText>

            {/* Suggested Answers */}
            <View className='flex-row flex-wrap justify-left mb-10'>
                {answers.map((answer) => (
                <SuggestedAnswers
                    key={answer}
                    title={answer}
                    isSelected={selectedAnswer === answer}
                    onPress={() => handlePress(answer)}
                />
                ))}
            </View>

            {/* Text Fields */}
            <View className='ml-2 mb-5'>
              <TextField
                label={textFieldLabel}
                value={inputValue}
                onChangeText={handleTextChange}
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
  
export default Template2;