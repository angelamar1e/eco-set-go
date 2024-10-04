import React, { useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';


const Transportation4 = () => {
    const router = useRouter();

    const category = "Transportation";
    const question3 = "What is the size of the car?";
    const answer3 = [
        'Small',
        'Average',
        'Utility vehicle',
        'Sedan',
        'SUV',
    ];
    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation5");
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation3")
    };

    return(
        <ThemedView className='flex-1 px-4'>
            <Template3
                category={category}
                question={question3}
                answer={answer3}
                onNext={handleNext}
                onBack={handleBack}
                showBackButton={true}
            />
        </ThemedView>
    )
};

export default Transportation4;
    
