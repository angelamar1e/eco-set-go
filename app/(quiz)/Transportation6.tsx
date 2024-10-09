import React, { useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';


const Transportation6 = () => {
    

    const category = "Transportation";
    const question3 = "What type of fuel does your car use?";
    const answer3 = [
        'Diesel (B7 or B10)',
        'Gasoline (E5 or E10 - Unleaded)',
    ];
    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation7");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation5")
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

export default Transportation6;
    
