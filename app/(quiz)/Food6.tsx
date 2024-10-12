import React, { useState } from 'react'; 
import { Template2 } from '../components/quiz/Template2';
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native-gesture-handler";

const BottledWater = () => {

    const category = "Bottled Water";
    const question = "Do you regularly purchase bottled water? ";
    const answers = [
        'Yes',
        'No',
        ];

    return (
        <ThemedView className="px-4">
            <ScrollView>
                <Template2
                    category={category}
                    question={question}
                    choices={answers}
                    unit={''}
                    defaultValue={''}                                        // to avoid errors
                    onAnswer={function (answer: string | number): void {    
                        throw new Error('Function not implemented.');
                    } } 
                />
            </ScrollView>
        </ThemedView>
    );
};

export default BottledWater;