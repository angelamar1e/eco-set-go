import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { Template1 } from '../components/quiz/Template1';

const Electricity1 = () => {

    const category="Electricity";
    const question="How many people live in your household?";
    const answers=[
        'I live alone',
        'Two persons',
        'Small family', //4 members
        'Large family', //6 members
    ]
    const unit = "persons";

    return (
        <ThemedView className="px-4">
            <ScrollView>
                <Template1
                category={category}
                question={question}
                choices={answers}
                unit={unit}
                defaultValue={''} 
                onAnswer={function (answer: string | number): void {
                    throw new Error('Function not implemented.');
                } }            
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Electricity1;
