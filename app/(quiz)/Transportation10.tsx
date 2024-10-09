import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

const Transportation10 = () => {
    const router = useRouter();

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "Over a year, how many hours do you travel on flights between 2 and 6 hours (medium-haul)?";
    const answers2 = ['Zero', 'Manila -> Davao', 'Manila -> Hongkong', 'Manila -> Bangkok', 'Manila -> Seoul'];
    const textFieldLabel2 = "hrs";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation11");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation9")
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

export default Transportation10;