import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template6 from '../components/quiz/Template6';

const Electricity3 = () => {
    const router = useRouter();

    const category="Electricity";
    const question1="What is the annual electricity production of your solar panels, whether consumed by you or fed back into the grid? ";
    const answers=[
        '1000 kWh',
        '2000 kWh',
        '4000 kWh',
    ]
    const question2="No statement? \nEnter your installed capacity here."
    const unit1="kWh"
    const unit2="panels"

    
    return (
        <ThemedView className="px-4">
            <ScrollView>
                <Template6
                category={category}
                question={question1}
                question2={question2}
                choices={answers}
                unit={unit1}
                //unit2:{unit2}
                defaultValue={''}                                        // to avoid errors
                onAnswer={function (answer: string | number): void {    
                    throw new Error('Function not implemented.');
                } } 
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Electricity3;
