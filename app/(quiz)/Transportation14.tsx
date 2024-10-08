import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

const Transportation14 = () => {
    const router = useRouter();

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "How many kilometers do you drive per year with your scooter or motorcycle?";
    const answers2 = ['Zero', 'Vacations (2,000 km)', '10 km/day (3,600 km)', '1,000 km/month (12,000 km)', '20,000 km/year'];
    const textFieldLabel2 = "km";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation15");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation13")
    };

    return (
        <ThemedView className='flex-1 p-4'>
            <Template2
                category={category}
                question={question2}
                answers={answers2}
                textFieldLabel={textFieldLabel2}
                onBack={handleBack}
                onNext={handleNext}
                showBackButton={true} 
            />
        </ThemedView>
    )
};

export default Transportation14;