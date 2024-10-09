import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template8 from '../components/quiz/Template8';

const Electricity5 = () => {
    const router = useRouter();

    const category="Electricity";
    const question="What is your household's annual electricity consumption from the grid? \n (Excluding consumption using your solar panels)";
    const textFieldLabel1 = "User input";
    const textFieldLabel2 = "No invoice? Enter your approximate monthly expenditure."

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
                question={question}
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

export default Electricity5;
