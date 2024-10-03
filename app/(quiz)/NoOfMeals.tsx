import { useState } from 'react';
import { View } from 'react-native';
import { QuestionContainer } from '@/app/components/quiz/QuestionContainer';
import { NavigationButton } from '@/app/components/quiz/NavigationButtons';
import { ThemedText } from '@/components/ThemedText';
import Stepper from '../components/quiz/Stepper';
import { ThemedView } from '@/components/ThemedView';

export default function NoOfMeals() {
  // Define initial value before using it in state
  const stepperInitialValue = 0;

  const question = "Choose 14 Meals";
  const stepperTitle = "Quantity";

  // State to manage the stepper value
  const [stepperValue, setStepperValue] = useState<number>(stepperInitialValue);


  return (
    <ThemedView className="flex-1 px-6">
      <QuestionContainer>
        {/* Display the question */}
        <ThemedText type="default" className="text-black mb-3">{question}</ThemedText>

        {/* Stepper */}
        <View className="mt-5 mb-5">
          <Stepper 
            title={stepperTitle}
            value={stepperValue} // Use stepperValue here
            onChange={setStepperValue} // Update state directly
          />
        </View>

        {/* Navigation Button */}
        <View className="mt-5 items-center">
          <NavigationButton
            title="Next"
            variant="primary"
            //Set navigation logic
          />
        </View>
      </QuestionContainer>
    </ThemedView>
  );
}
