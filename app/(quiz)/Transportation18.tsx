import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

const Transportation18 = () => {
    

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "How many kilometers do you travel by train per year?";
    const answers2 = [
        'Twice a month * LRT-1 Baclaran to Gil Puyat', 
        'Twice a week  * LRT-2 Cubao to Pureza',];
    const textFieldLabel2 = "km";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation19");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation17")
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

export default Transportation18;