import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

const Transportation9 = () => {
    const router = useRouter();

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "Over a year, how many hours of short-haul flights do you travel?";
    const answers2 = ['Zero', 'Manila -> Caticlan', 'Manila -> Ilo-Ilo', 'Manila -> Bacolod'];
    const textFieldLabel2 = "hrs";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation10");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation8")
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

export default Transportation9;