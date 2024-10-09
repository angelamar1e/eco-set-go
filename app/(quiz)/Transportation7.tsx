import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

const Transportation7 = () => {
    

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "Do you know the average fuel consumption of the car?";
    const answers2 = ['5l/100 km', '7l/100km', '9l/100km'];
    const textFieldLabel2 = "0l/0km";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation8");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation6")
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

export default Transportation7;