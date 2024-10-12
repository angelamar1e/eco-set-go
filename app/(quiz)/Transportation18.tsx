import React from 'react';
import { Template1 } from '../components/quiz/Template1';
import { ThemedView } from '@/components/ThemedView';

const Transportation18 = () => {
    

    // Template 2 states and handlers
    const category = "Transportation";
    const question2 = "How many kilometers do you travel by train per year?";
    const answers2 = [
        'Twice a month * LRT-1 Baclaran to Gil Puyat', 
        'Twice a week  * LRT-2 Cubao to Pureza',];
    const unit = "km";


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

export default Transportation18;