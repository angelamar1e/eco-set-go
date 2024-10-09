import React from "react";
import Template4 from "../components/quiz/Template4";
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';


const Transportation15 = () => {
    

    // Template 4 states and handlers
    const category = "Transportation";
    const question4 = "What are your efficient modes of transport?";
    const answers4 = ['Walking', 'Bicycle', 'Electrically Assisted Bikes ', 'Small electric vehicles (Electric scooter, hoverboard, etc.)'];

    const handleNext = () => {
        console.log('Next button pressed');
        router.push("/(quiz)/Transportation16");    
    };

    const handleBack = () => {
        router.push("/(quiz)/Transportation14")
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

export default Transportation15;



            
