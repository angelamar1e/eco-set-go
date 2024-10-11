import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import Template5 from '../components/quiz/Template5';

const HotDrinks = () => {
    

    const category = "Drinks";
    const question = "How many cups of hot drinks do you drink in a day? ";
    const answers = [
        'No hot drinks',
        'A coffee',
        'Lots of coffee',
        'Coffee and tea',
        'A hot chocolate'
    ];
    const stepperTitle = [
        'Coffee', 
        'Tea', 
        'Hot Chocolate', 
    ];
    const stepperInitialValue = 0;


    return (
        <ThemedView className="px-4">
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

export default HotDrinks;
