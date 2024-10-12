import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { QuestionContainer } from './QuestionContainer';
import { PresetChoices } from './PresetChoices';
import Stepper from './Stepper';
import { NavigationButtons } from './NavigationButtons';
import { StepperTemplateProps, TemplateProps } from '@/types/QuizProps';

const StepperTemplate: FC<StepperTemplateProps> = ({
    category,
    question,
    choices,
    stepperTitle,
}) => {
    // State to manage the selected answer
    const [selectedAnswer, setSelectedAnswer] = useState<string>();

    // State to manage the stepper values as an array
    const [stepperValues, setStepperValues] = useState<number[]>(new Array(stepperTitle?.length).fill(0));

    // Function to handle answer selection
    const handlePress = (answer: string) => {
        setSelectedAnswer(answer);
    };

    // Handle stepper value changes
    const handleStepperChange = (index: number, value: number) => {
        const updatedValues = [...stepperValues];
        updatedValues[index] = value;
        setStepperValues(updatedValues);
    };

    return (
        <ThemedView className="flex-1 px-6">
            <QuestionContainer>
                <ThemedText type='defaultSemiBold' className='text-lime-800 mb-3'>{category}</ThemedText>
                <ThemedText type="default" className="text-black text-[20px] mb-3">{question}</ThemedText>

                {/* Suggested Answers */}
                <View className="flex-row flex-wrap justify-left mb-3">
                    {answers.map((answer) => (
                        <PresetChoices
                            key={answer}
                            title={answer}
                            isSelected={selectedAnswer === answer}
                            onPress={() => handlePress(answer)}
                        />
                    ))}
                </View>

                {/* Stepper */}
                <View className="mt-5 mb-5 justify-center mt-10 mb-3">
                    {stepperTitle.map((title, index) => (
                        <Stepper 
                            key={title}
                            title={title}
                            value={stepperValues[index]} // Use the specific stepper's value
                            onChange={(value) => handleStepperChange(index, value)} // Pass the index
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

export default StepperTemplate;
