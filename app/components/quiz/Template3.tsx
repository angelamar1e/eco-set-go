import { useState, FC } from 'react';
import { View } from 'react-native';
import { QuestionContainer } from '@/app/components/quiz/QuestionContainer';
import { NavigationButton } from '@/app/components/quiz/NavigationButtons';
import { ThemedText } from '@/components/ThemedText';
import { RadioChoices } from '@/app/components/quiz/RadioChoices';
import { ThemedView } from '@/components/ThemedView';

interface Template3Props {
    question: string;
    answer: string[];
    navigationNext: string;
    navigationPrevious: string;
    onNavigationPress: () => void;
}

export const Template3: FC<Template3Props> = ({
        question,
        answer,
        navigationNext,
        navigationPrevious,
        onNavigationPress,
    }) => 
        
    {
        const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

        const handleChoiceSelect = (choiceId: number) => {
          setSelectedChoice(choiceId);
      
        };
    
        return (
            <ThemedView className="flex-1 px-6">
            <QuestionContainer>
                <ThemedText type="default" className='text-black text-[20px] mb-3'>
                    {question}
                </ThemedText>
                
                <View className="flex-wrap flex-row justify-center">
                    {answer.map((answer, index) => (
                        <RadioChoices
                            key={index}
                            title={answer}
                            isSelected={selectedChoice === index + 1} 
                            onPress={() => handleChoiceSelect(index + 1)}
                        />
                    ))}
                </View>

                <View className="flex flex-row mt-4 justify-between">
                <NavigationButton
                    title={navigationPrevious}
                    variant="secondary"
                />
                <NavigationButton
                    title={navigationNext}
                    variant="primary"
                />
                </View>
            
            </QuestionContainer>
        
        </ThemedView>

        );

    };
