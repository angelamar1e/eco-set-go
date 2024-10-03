import React, { useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';


const Transportation3 = () => {
    const router = useRouter();

    const category = "Transportation";
    const question3 = "Do you mostly use the same car to get around?";
    const answer3 = [
        'Yes, and I own it',
        'Yes, but it is not mine',
        'No, I chane often (car sharing, relatives, taxi/Grab, etc.)',
    ];
    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation4");
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation2")
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

export default Transportation3;
    
