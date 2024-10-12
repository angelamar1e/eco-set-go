import React from 'react';
import { Template1 } from '../components/quiz/Template1';
import { ThemedView } from '@/components/ThemedView';

const Transportation20 = () => {
    

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "How many hours do you spend on a bus/train/jeepney/tricycle per week?";
    const answers2 = [
        '30 mins / day ', 
        '1 hour / day',
        '1 hour and 30 mins / day',
        '2 hours / day'];
    const unit = "hrs";


    return (
        <ThemedView className='px-4'>
            <Template1
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

export default Transportation20;