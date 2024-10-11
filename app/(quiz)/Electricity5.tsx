import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template8 from '../components/quiz/Template8';

const Electricity5 = () => {
    const router = useRouter();

    const category="Electricity";
    const question1="What is your household's annual electricity consumption from the grid? (Excluding consumption using your solar panels)";
    const question2="No invoice? \nEnter your approximate monthly expenditure."
    const unit1="kWh"
    const unit2="pesos"

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
                <Template8
                category={category}
                question1={question1}
                question2={question2}
                onNext={onNext}
                onBack={onBack}
                showBackButton={true}
                unit1={unit1}
                unit2={unit2}
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Electricity5;
