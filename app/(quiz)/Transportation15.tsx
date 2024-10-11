import React from "react";
import Template4 from "../components/quiz/Template4";
import { ThemedView } from '@/components/ThemedView';


const Transportation15 = () => {
    

    // Template 4 states and handlers
    const category = "Transportation";
    const question = "What are your efficient modes of transport?";
    const answers = ['Walking', 'Bicycle', 'Electrically Assisted Bikes ', 'Small electric vehicles (Electric scooter, hoverboard, etc.)'];


    return(
        <ThemedView className="px-4">
            <Template4
                category={category}
                question={question}
                choices={answers}
                unit=''
                defaultValue={''} 
                onAnswer={function (answer: string | number): void {
                    throw new Error('Function not implemented.');
                } }     
            />
        </ThemedView>
    )
};

export default Transportation15;



            
