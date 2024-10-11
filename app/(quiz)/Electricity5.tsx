import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import Template8 from '../components/quiz/Template8';

const Electricity5 = () => {

    const category="Electricity";
    const question1="What is your household's annual electricity consumption from the grid? (Excluding consumption using your solar panels)";
    const question2="No invoice? \nEnter your approximate monthly expenditure."
    const unit1="kWh"
    const unit2="pesos"

    return (
        <ThemedView className="flex-1 px-4">
            <ScrollView>
                <Template8
                category={category}
                question={question1}
                //question2={question2}
                unit={unit1}
                //unit2={unit2}
                defaultValue={''}                                        // to avoid errors
                onAnswer={function (answer: string | number): void {    
                    throw new Error('Function not implemented.');
                } } 
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Electricity5;
