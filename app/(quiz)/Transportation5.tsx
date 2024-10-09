import React, { useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';

const Transportation5 = () => {
    

    const category = "Transportation";
    const question3 = "What type of car do you use?";
    const answer3 = [
        'Thermal (diesel/petrol)',
        'Hybrid',
        'Electric',
    ];
    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation6");
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation4")
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

export default Transportation5;
    
