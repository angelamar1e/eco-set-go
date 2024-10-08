import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';


const Transportation2 = () => {
    const router = useRouter();

    // Template 2 states and handlers
    const category = "Transporation";
    const question2 = "What is the average number of passengers in the car?";
    const answers2 = ['Only one', 'Two', 'Five'];
    const textFieldLabel2 = " ";

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation3");
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation1")
    };

    return (
        <ThemedView className='flex-1 px-4'>
            <Template2
                category={category}
                question={question2}
                answers={answers2}
                textFieldLabel={textFieldLabel2}
                onNext={handleNext}
                onBack={handleBack}
                showBackButton={true}
            />
        </ThemedView>
    )
};

export default Transportation2;