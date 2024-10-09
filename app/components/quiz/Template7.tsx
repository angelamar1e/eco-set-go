import React, { FC,useState} from 'react';
import { View} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { QuestionContainer } from './QuestionContainer';
import { SuggestedAnswers } from './SuggestedAnswers';
import { TextField } from './TextField';
import { NavigationButtons } from './NavigationButtons';

interface Template7Props {
    category: string;
    question: string;
    answers: string[];
    textFieldLabel1: string;
    textFieldLabel2: string;
    onNext: () => void;         
    onBack?: () => void;        
    showBackButton?: boolean;  
  }

export const Template7: FC<Template7Props> = ({
    category,
    question,
    answers,
    textFieldLabel1,
    textFieldLabel2,
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
                label={textFieldLabel1}
                value={inputValue}
                onChangeText={handleTextChange}
              />
            </View>

            <View className='ml-2 mb-5 rounded-lg bg-[#9CD87E] border-2 border-lime-800'>
              <TextField
                label={textFieldLabel2}
                value={inputValue}
                onChangeText={handleTextChange}
              />
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
  
export default Template7;