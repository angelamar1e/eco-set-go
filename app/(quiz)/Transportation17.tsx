import React from 'react';
import Template2 from '../components/quiz/Template2';
import { ThemedView } from '@/components/ThemedView';

const Transportation17 = () => {
    

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "How many kilometers do you cover per year with your electric scooter, hoverboard...?";
    const answers2 = [
        'I use it occasionally', 
        'I use it to go to work',
        '10 km/day',
        '100 km/week'];
    const unit = "km";


    return (
        <ThemedView className='flex-1 p-4'>
            <Template2
                category={category}
                question={question2}
                choices={answers2}
                unit={unit}
                defaultValue={''}                                        // to avoid errors
                onAnswer={function (answer: string | number): void {    
                    throw new Error('Function not implemented.');
                } } 
            />
        </ThemedView>
    )
};

export default Transportation17;