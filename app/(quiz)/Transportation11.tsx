import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

const Transportation11 = () => {
    const router = useRouter();

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "Over a year, how many hours do you travel on flights on more than 6 hours (large-haul)?";
    const answers2 = ['Zero', 'Manila -> Chennai', 'Manila -> Dubai', 'Manila -> Auckland, NZ', 'Manila -> New York'];
    const textFieldLabel2 = "hrs";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation12");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation10")
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

export default Transportation11;