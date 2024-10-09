import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template7 from '../components/quiz/Template7';

const Electricity3 = () => {
    const router = useRouter();

    const category="Electricity";
    const question1="What is the annual electricity production of your solar panels, whether consumed by you or fed back into the grid? ";
    const answers=[
        '1000 kWh',
        '2000 kWh',
        '4000 kWh',
    ]
    const question2="No statement? \nHow many panels do you have installed?"
    const textFieldLabel1 = "kWh";
    const textFieldLabel2 = "number of panels";

    const onNext = () => {
        console.log('Next button pressed');
        router.push('/(quiz)/Electricity4');
        };

    const onBack = () => {
        console.log('Back button pressed');
        router.back(); 
    };

    return (
        <ThemedView className="flex-1 px-4">
            <ScrollView>
                <Template7
                category={category}
                question1={question1}
                question2={question2}
                answers={answers}
                textFieldLabel1={textFieldLabel1}
                textFieldLabel2={textFieldLabel2}
                onNext={onNext}
                onBack={onBack}
                showBackButton={true}
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Electricity3;
