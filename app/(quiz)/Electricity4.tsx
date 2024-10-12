import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { Template1 } from '../components/quiz/Template1';

const Electricity4 = () => {

    const category="Electricity";
    const question="How much electricity do you consume from solar panels?";
    const answers=[
        'A quarter of my production',
        'Half of my production',
        'I consume 100% of what I produce',
    ]
    const unit = "percent";

    return (
        <ThemedView className="px-4">
            <ScrollView>
                <Template1
                category={category}
                question={question}
                choices={answers}
                unit={unit}
                defaultValue={''}                                        // to avoid errors
                onAnswer={function (answer: string | number): void {    
                    throw new Error('Function not implemented.');
                } } 
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Electricity4;
