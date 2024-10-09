import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template5 from '../components/quiz/Template5';

const Food3 = () => {
    const router = useRouter();

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

    const onNext = () => {
        console.log('Next button pressed');
        router.push('/(quiz)/Food4');
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

export default Food3;
