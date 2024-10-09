import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template5 from '../components/quiz/Template5';

const Food2 = () => {
    const router = useRouter();

    const category = "Meals";
    const question = "Choose the 14 meals (lunches and dinners) for your typical week";
    const answers = [
        'Vegan',
        'Vegetarian',
        'Little meat',
        'Meat every day',
    ];
    const stepperTitle = [
        'Vegan', 
        'Vegetarian', 
        'Pork Meat Meal', 
        'Beef Meat Meal', 
        'Fish Meat Meal', 
        'Chicken Meat Meal'
    ];
    const stepperInitialValue = 0;

    const onNext = () => {
        console.log('Next button pressed');
        router.push('/(quiz)/Food3');
    };

    const onBack = () => {
        console.log('Back button pressed');
        router.back(); 
    };

    return (
        <ThemedView className="flex-1 px-4">
            <ScrollView>
                <Template5
                    category={category}
                    question={question}
                    answers={answers}
                    stepperTitle={stepperTitle}
                    stepperInitialValue={stepperInitialValue}
                    onNext={onNext}
                    onBack={onBack}
                    showBackButton={true}
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Food2;
