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
        <ThemedText type="default">
          What kind of breakfast do you usually eat?
        </ThemedText>
        <View className="flex-auto flex-row mt-4">
          {['Bread and pastries', 'Milk and cereals', 'Salty (toast, egg, cold cut)', 'Filipino breakfast (rice & cold cut)', 'Fruit', 'No Breakfast'].map((title, index) => (
            <RadioChoices
              key={index}
              title={title}
              isSelected={selectedChoice === index + 1}
              onPress={() => handleChoiceSelect(index + 1)}
            />
          ))}
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
