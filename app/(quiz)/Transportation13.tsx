import React, { useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';


const Transportation13 = () => {
    

    const category = "Transportation";
    const question3 = "What is the engine of your scooter or motorcycle?";
    const answer3 = [
        'Electrical',
        '50 cc',
        'Less than 250 cc',
        'More than 250 cc'
    ];
    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation14");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation12")
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

export default Transportation13;
    
