import React from "react";
import Template4 from "../components/quiz/Template4";
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';


const Transportation19 = () => {
    const router = useRouter();

    // Template 4 states and handlers
    const category = "Transportation";
    const question4 = "What public transport do you use regularly?";
    const answers4 = ['Bus', 'Jeepney', 'Tricycle', 'None'];

    const handleNext = () => {
        // Implement your navigation logic here (e.g., navigate to the next question)
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



            
