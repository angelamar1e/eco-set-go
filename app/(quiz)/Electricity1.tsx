import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template2 from '../components/quiz/Template2';

const Electricity1 = () => {
    const router = useRouter();

    const category="Electricity";
    const question="How many people live in your household?";
    const answers=[
        'I live alone',
        'Two persons',
        'Small family', //4 members
        'Large family', //6 members
    ]
    const textFieldLabel = "Please specify how many are you in the household";

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
                <Template2
                category={category}
                question={question}
                answers={answers}
                textFieldLabel={textFieldLabel}
                onNext={onNext}
                onBack={onBack}
                showBackButton={true}
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Electricity1;
