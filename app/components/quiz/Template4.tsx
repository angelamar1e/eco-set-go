import React, { FC, useState} from 'react';
import { View} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { QuestionContainer } from './QuestionContainer';
import { CheckboxChoices } from './Checkbox';
import { NavigationButton } from './NavigationButton';

interface Template4Props {
    question: string;
    answers: string[];
    navigationButtonTitle: string;
    onNavigationPress: () => void;
}

const Template4: FC<Template4Props> = ({
    question,
    answers,
    navigationButtonTitle,
    onNavigationPress,
}) => {

    // State to manage selected answers (multiple selections allowed)
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

    // Function to handle checkbox toggle
    const handleCheckboxPress = (answer: string) => {
        if (selectedAnswers.includes(answer)) {
            // Remove answer if already selected
            setSelectedAnswers(selectedAnswers.filter(item => item !== answer));
        } else {
            // Add answer if not selected
            setSelectedAnswers([...selectedAnswers, answer]);
        }
    };

    return (
        <ThemedView className="flex-1 px-6">
            <QuestionContainer>
                <ThemedText type="default" className="text-black text-[20px] mb-3">{question}</ThemedText>

                 {/* Checkboxes */}
                <View className="flex-row flex-wrap justify-left">
                    {answers.map((answer) => (
                        <CheckboxChoices
                            key={answer}
                            title={answer}
                            isChecked={selectedAnswers.includes(answer)}
                            onPress={() => handleCheckboxPress(answer)}
                        />
                    ))}
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

export default Template4;