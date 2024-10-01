import { useState } from 'react';
import { View } from 'react-native';
import { QuestionContainer } from '@/app/components/quiz/QuestionContainer';
import { NavigationButton } from '@/app/components/quiz/NavigationButtons';
import { ThemedText } from '@/components/ThemedText';
import { RadioChoices } from '@/app/components/quiz/RadioChoices';
import { ThemedView } from '@/components/ThemedView';

export default function RadioButton() {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleChoiceSelect = (choiceId: number) => {
    setSelectedChoice(choiceId);

  };

  return (
    <ThemedView>
      <QuestionContainer>
        <ThemedText type="subtitle">
            Food Section
        </ThemedText>
       
        <ThemedText type="default">
          What kind of breakfast do you usually eat?
        </ThemedText>
        
        <View className="flex-wrap flex-row justify-between">
            <RadioChoices
                title="Bread and pastries"
                isSelected={selectedChoice === 1}
                onPress={() => handleChoiceSelect(1)}
            />
            <RadioChoices
                title="Bread and pastries"
                isSelected={selectedChoice === 2}
                onPress={() => handleChoiceSelect(2)}
            />   
        </View>

        <View className="flex-wrap flex-row justify-between">
            <RadioChoices
                title="Salty"
                isSelected={selectedChoice === 3}
                onPress={() => handleChoiceSelect(3)}
            />
            <RadioChoices
                title="Filipino Breakfast"
                isSelected={selectedChoice === 4}
                onPress={() => handleChoiceSelect(4)}
            />   
        </View>
       
        <View className="flex-wrap flex-row justify-between">
            <RadioChoices
                title="Fruit"
                isSelected={selectedChoice === 5}
                onPress={() => handleChoiceSelect(5)}
            />
            <RadioChoices
                title="No Breakfast"
                isSelected={selectedChoice === 6}
                onPress={() => handleChoiceSelect(6)}
            />   
        </View>

        <View className="flex flex-row mt-4 justify-between">
          <NavigationButton
            title="Previous"
            variant="secondary"
          />
          <NavigationButton
            title="Next"
            variant="primary"
          />
        </View>
      
      </QuestionContainer>
   
    </ThemedView>
  );
}
