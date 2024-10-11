import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';

const Transportation16 = () => {
    

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "How many kilometers do you cover per year with your Electrically Assisted Bike (EAB)?";
    const answers2 = [
        'I use it occasionally', 
        'I use it to go to work',
        '10 km/day',
        '100 km/week'];
    const unit = "km";

    return (
        <ThemedView className='px-4'>
            <Template2
                category={category}
                question={question2}
                choices={answers2}
                unit={unit} 
                defaultValue={''} 
                onAnswer={function (answer: string | number): void {
                    throw new Error('Function not implemented.');
                } }            
            />
        </ThemedView>
    )
};

export default Transportation16;