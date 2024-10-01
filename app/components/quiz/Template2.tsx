import React, { FC,useState} from 'react';
import { View} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { QuestionContainer } from './QuestionContainer';
import { SuggestedAnswers } from './SuggestedAnswers';
import { TextField } from './TextField';
import { NavigationButton } from './NavigationButton';

interface Template2Props {
    question: string;
    answers: string[];
    textFieldLabel: string;
    navigationButtonTitle: string;
    onNavigationPress: () => void;
  }

  const Template2: FC<Template2Props> = ({
    question,
    answers,
    textFieldLabel,
    navigationButtonTitle,
    onNavigationPress,
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
            <ThemedText type="default" className='text-black mb-3'>{question}</ThemedText>

            {/* Suggested Answers */}
            <View className='flex-row flex-wrap justify-between mb-3'>
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
            <TextField
              label={textFieldLabel}
              value={inputValue}
              onChangeText={handleTextChange}
            />

            <View className='mt-5 items-center '>
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
  
export default Template2;