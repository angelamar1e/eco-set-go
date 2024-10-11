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
    question1: string;
    question2: string;
    answers: string[];
    onNext: () => void;         
    onBack?: () => void;        
    showBackButton?: boolean;  
    unit1: string;
    unit2:string;
  }

export const Template7: FC<Template7Props> = ({
    category,
    question1,
    question2,
    answers,
    onNext,
    onBack,
    showBackButton = true, 
    unit1,
    unit2,
}) => {
 
  // State to manage selected answer
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // State to manage the input value in the TextField1
  const [inputValue1, setInputValue1] = useState<string>("");

  // State to manage the input value in the TextField2
  const [inputValue2, setInputValue2] = useState<string>("");

  // Function to handle answer selection
  const handlePress = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Function to handle text input change 1
  const handleTextChange1 = (text: string) => {
    setInputValue1(text);
    };

  // Function to handle text input change 2
  const handleTextChange2 = (text: string) => {
    setInputValue2(text);
    };

    return (
      <ThemedView className="flex-1 px-6">
        <QuestionContainer>
            <ThemedText type='defaultSemiBold' className='text-lime-800 mb-3'>{category}</ThemedText>
            <ThemedText type="default" className='text-black text-[20px] mb-3'>{question1}</ThemedText>

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
                value={inputValue1}
                onChangeText={handleTextChange1}
                unit={unit1}
              />
            </View>

            <View className='mt-5 ml-2 mb-5'>
            <ThemedText type="default" className='text-black text-[20px] mb-3'>{question2}</ThemedText>
              <TextField
                value={inputValue2}
                onChangeText={handleTextChange2}
                unit={unit2}
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