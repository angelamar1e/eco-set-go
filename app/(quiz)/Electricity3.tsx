import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template7 from '../components/quiz/Template7';

const Electricity3 = () => {
    const router = useRouter();

    const category="Electricity";
    const question="What is the annual electricity production of your solar panels, whether consumed by you or fed back into the grid? ";
    const answers=[
        '1000 kWh',
        '2000 kWh',
        '4000 kWh',
        '4000 kWh', 
    ]
    const textFieldLabel1 = "User input";

    const textFieldLabel2 = "No statement? Enter your installed capacity here."

    const onNext = () => {
        console.log('Next button pressed');
        router.push('/(tabs)/Home');
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
                question={question}
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
