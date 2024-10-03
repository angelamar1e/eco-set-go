import { useState, FC } from 'react';
import { View } from 'react-native';
import { QuestionContainer } from '@/app/components/quiz/QuestionContainer';
import { NavigationButtons } from '@/app/components/quiz/NavigationButtons';
import { ThemedText } from '@/components/ThemedText';
import { RadioChoices } from '@/app/components/quiz/RadioChoices';
import { ThemedView } from '@/components/ThemedView';

interface Template3Props {
    category: string;
    question: string;
    answer: string[];
    onNext: () => void;         
    onBack?: () => void;        
    showBackButton?: boolean;
}

export const Template3: FC<Template3Props> = ({
        category,
        question,
        answer,
        onNext,
        onBack,
        showBackButton = true, 
    }) => 
        
    {
        const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

        const handleChoiceSelect = (choiceId: number) => {
          setSelectedChoice(choiceId);
      
        };
    
        return (
            <ThemedView className="flex-1 px-6">
            <QuestionContainer>
                <ThemedText type='defaultSemiBold' className='text-lime-800 mb-3' >{category}</ThemedText>
                <ThemedText type="default" className='text-black text-[20px] mb-3'>
                    {question}
                </ThemedText>
                
                {/* Radio Chouces */}
                <View className="flex-wrap flex-row justify-center mt-10 mb-3">
                    {answer.map((answer, index) => (
                        <RadioChoices
                            key={index}
                            title={answer}
                            isSelected={selectedChoice === index + 1} 
                            onPress={() => handleChoiceSelect(index + 1)}
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
