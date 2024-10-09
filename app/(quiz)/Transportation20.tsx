import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

const Transportation20 = () => {
    

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "How many hours do you spend on a bus/train/jeepney/tricycle per week?";
    const answers2 = [
        '30 mins / day ', 
        '1 hour / day',
        '1 hour and 30 mins / day',
        '2 hours / day'];
    const textFieldLabel2 = "hrs";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Food1");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation19")
    };

    return (
        <ThemedView className='flex-1 p-4'>
            <Template2
                category={category}
                question={question2}
                choices={answers2}
                textFieldLabel={textFieldLabel2}
                onBack={handleBack}
                onNext={handleNext}
                showBackButton={true} 
            />
        </ThemedView>
    )
};

export default Transportation20;