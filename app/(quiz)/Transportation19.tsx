import React from "react";
import { ThemedView } from '@/components/ThemedView';
import Template3 from "../components/quiz/Template3";


const Transportation19 = () => {
    

    // Template 4 states and handlers
    const category = "Transportation";
    const question4 = "What public transport do you use regularly?";
    const answers4 = ['Bus', 'Jeepney', 'Tricycle', 'None'];


    return(
        <ThemedView className="px4">
            <Template3
                category={category}
                question={question4}
                choices={answers4}
                unit={''}
                defaultValue={''}                                        // to avoid errors
                onAnswer={function (answer: string | number): void {    
                    throw new Error('Function not implemented.');
                } } 
            />
        </ThemedView>
    )
};

export default Transportation19;



            
