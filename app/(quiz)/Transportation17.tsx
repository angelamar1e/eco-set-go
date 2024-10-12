import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

const Transportation17 = () => {
    

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "How many kilometers do you cover per year with your electric scooter, hoverboard...?";
    const answers2 = [
        'I use it occasionally', 
        'I use it to go to work',
        '10 km/day',
        '100 km/week'];
    const textFieldLabel2 = "km";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation18");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation16")
    };

    return (
        <ThemedView className='flex-1 p-4'>
            <Template2
                category={category}
                question={question2}
                choices={answers2}
                inputLabel={textFieldLabel2}
                onBack={handleBack}
                onNext={handleNext}
                showBackButton={true} 
            />
        </ThemedView>
    )
};

export default Transportation17;