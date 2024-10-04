import React, { useState } from 'react';
import {Template3} from '../components/quiz/Template3';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';


const Transportation12 = () => {
    const router = useRouter();

    const category = "Transportation";
    const question3 = "Do you use a scooter or motobike?";
    const answer3 = [
        'Yes',
        'No',
    ];
    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation13");
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation11")
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

export default Transportation12;
    
