import React, { useState } from 'react'; 
import { Template3 } from '../components/quiz/Template3';
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
        <ThemedView className="flex-1 px-4">
            <ScrollView>
                <Template3
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