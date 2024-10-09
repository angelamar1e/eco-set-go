import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template2 from '../components/quiz/Template2';

const Electricity3 = () => {
    const router = useRouter();

    const category="Electricity";
    const question="How much electricity do you consume from solar panels?";
    const answers=[
        'A quarter of my production',
        'Half of my production',
        'I consume 100% of what I produce',
    ]
    const textFieldLabel = "Please specify your exact consumption";

    const onNext = () => {
        console.log('Next button pressed');
        router.push('/(quiz)/Electricity5');
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

export default Electricity3;
