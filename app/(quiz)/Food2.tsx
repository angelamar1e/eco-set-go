import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import Template5 from '../components/quiz/Template5';

const NoOfMeals = () => {
    

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


    return (
        <ThemedView className="flex-1 px-4">
            <ScrollView>
                <Template5
                    category={category}
                    question={question}
                    answers={answers}
                    stepperTitle={stepperTitle}
                    stepperInitialValue={stepperInitialValue}
                />
            </ScrollView>
        </ThemedView>
    );
};

export default NoOfMeals;
