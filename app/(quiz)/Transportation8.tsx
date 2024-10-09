import React, { useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';


const Transportation8 = () => {
    

    const category = "Transportation";
    const question3 = "Have you flown at least once in the last 3 years?";
    const answer3 = [
        'Yes',
        'No',
    ];
    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation9");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation7")
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

export default Transportation8;
    
