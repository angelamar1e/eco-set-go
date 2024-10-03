import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

const Transportation1 = () => {
    const router = useRouter();

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "How far do you travel per year by car?";
    const answers2 = ['Zero', 'Vacations', '10 km/day', '1,000 km/month', '20,000 km/month'];
    const textFieldLabel2 = "km";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation2");
    };

    return (
        <ThemedView className='flex-1 p-4'>
            <Template2
                category={category}
                question={question2}
                answers={answers2}
                textFieldLabel={textFieldLabel2}
                onNext={handleNext}
                showBackButton={false} 
            />
        </ThemedView>
    )
};

export default Transportation1;