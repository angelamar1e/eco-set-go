import { useState } from 'react';
import { View } from 'react-native';
import { QuestionContainer } from '@/app/components/quiz/QuestionContainer';
import { NavigationButtons } from '@/app/components/quiz/NavigationButtons';
import { ThemedText } from '@/components/ThemedText';
import Stepper from '../components/quiz/Stepper';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';

const NoOfMeals = () => {
  // Define initial value before using it in state
  const stepperInitialValue = 0;

  const question = "Choose the 14 meals (lunches and dinners) for your typical week ";

  // State to manage the stepper value
  const [stepperValue, setStepperValue] = useState<number>(stepperInitialValue);


  return (
    <ThemedView className="flex-1 px-6">
        <ScrollView>
            <QuestionContainer>
                {/* Display the question */}
                <ThemedText type="default" className="text-black mb-3">{question}</ThemedText>

                {/* Stepper */}
                <View className="mt-5 mb-5">
                <Stepper 
                    title="Vegan"
                    value={stepperValue}
                    onChange={setStepperValue} 
                />

                <Stepper 
                    title="Vegetarian"
                    value={stepperValue}
                    onChange={setStepperValue} 
                />

                <Stepper 
                    title="Pork Meat Meal"
                    value={stepperValue}
                    onChange={setStepperValue} 
                />

                <Stepper 
                    title="Beef Meat Meal"
                    value={stepperValue}
                    onChange={setStepperValue} 
                />
                <Stepper 
                    title="Fish Meat Meal"
                    value={stepperValue}
                    onChange={setStepperValue} 
                />
                <Stepper 
                    title="Chicken Meat Meal"
                    value={stepperValue}
                    onChange={setStepperValue} 
                />
                </View>

                {/* Navigation Button */}
                <View className="mt-5 items-center">
                <NavigationButtons
                    title="Next"
                    variant="primary"
                    //Set navigation logic
                />
                </View>
            </QuestionContainer>

        </ScrollView>
    </ThemedView>
  );
};

export default NoOfMeals;