import React from "react";
import Template4 from "../components/quiz/Template4";
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';


const Transportation19 = () => {
    

    // Template 4 states and handlers
    const category = "Transportation";
    const question4 = "What public transport do you use regularly?";
    const answers4 = ['Bus', 'Jeepney', 'Tricycle', 'None'];

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation20");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation18")
    };

    return(
        <Template4
                category={category}
                question={question4}
                answers={answers4}
                onBack={handleBack}
                onNext={handleNext}
                showBackButton={true} 
        />
    )
};

export default Transportation19;



            
