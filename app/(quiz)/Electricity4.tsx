import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import Template2 from '../components/quiz/Template2';

const Electricity4 = () => {

    const category="Electricity";
    const question="How much electricity do you consume from solar panels?";
    const answers=[
        'A quarter of my production',
        'Half of my production',
        'I consume 100% of what I produce',
    ]
    const unit = "Please specify your exact consumption percentage";

    return (
        <ThemedView className="flex-1 px-4">
            <ScrollView>
                <Template2
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
