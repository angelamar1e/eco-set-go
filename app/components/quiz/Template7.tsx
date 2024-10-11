import React, { FC,useState} from 'react';
import { Text, View} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { QuestionContainer } from './QuestionContainer';
import { PresetChoices } from "./PresetChoices";
import { TextField } from './TextField';
import { TemplateProps } from "@/types/QuizProps";


export const Template7: FC<TemplateProps> = ({
    category,
    question,
    choices,
    unit,
    defaultValue,
    onAnswer,
}) => {
 
  // State to manage selected answer from preset choices
  const [answer, setAnswer] = useState<number>();

  // State to manage the input value in the TextField1
  const [inputValue1, setInputValue1] = useState<string>("");

  // State to manage the input value in the TextField2
  const [inputValue2, setInputValue2] = useState<string>("");

  // Function to handle answer selection
  const handlePress = (answer: number) => {
    setAnswer(answer);
    setInputValue1(answer.toString());
    onAnswer(answer);
  };

  // Function to handle text input change 1
  const handleTextChange1 = (text: string) => {
    setInputValue1(text);
    };

  // Function to handle text input change 2
  const handleTextChange2 = (text: string) => {
    setInputValue2(text);
    };

  // Handle blur event for the input fields
  const handleBlur = () => {
    const parsedInput1 = parseInt(inputValue1, 10) || 0;  // Convert to number or default to 0
    const parsedInput2 = parseInt(inputValue2, 10) || 0;  // Convert to number or default to 0

    // Call onAnswer with the combined results of both inputs (or adjust logic as needed)
    onAnswer(parsedInput1 + parsedInput2); 
  };

    return (
      <ThemedView className="flex-1 px-6">
        <QuestionContainer>
            <ThemedText type='defaultSemiBold' className='text-lime-800 mb-3'>{category}</ThemedText>
            <ThemedText type="default" className='text-black text-[20px] mb-3'>{question}</ThemedText>

            <View className="flex-row flex-wrap justify-left mb-10">
            {choices ? (
              Object.entries(choices).map(([key, value]) => (
                <PresetChoices
                  key={key}
                  title={key}
                  isSelected={answer || answer == 0 ? answer === value : value === defaultValue}
                  onPress={() => handlePress(value)}
                />
              ))
            ) : (
              <Text> Loading... </Text>
            )}
            </View>

            {/* Text Fields */}
            <View className='ml-2 mb-5'>
              <TextField
                value={inputValue1}
                onChangeText={handleTextChange1}
                onBlur={handleBlur}
                unit={unit}
              />
            </View>

            <View className='mt-5 ml-2 mb-5'>
            <ThemedText type="default" className='text-black text-[20px] mb-3'>{question}</ThemedText>
              <TextField
                value={inputValue2}
                onChangeText={handleTextChange2}
                onBlur={handleBlur}
                unit={unit}
              />
            </View>
        </QuestionContainer>
      </ThemedView>
    );
  };
  
export default Template7;