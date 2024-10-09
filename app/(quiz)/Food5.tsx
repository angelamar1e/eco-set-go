import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import Template2 from '../components/quiz/Template2';

const Food5 = () => {
    const router = useRouter();

    const category="Drinks";
    const question="How often is your weekly consumption of alcohol? (wine, beer, etc.)";
    const answers=[
        'Once a week',
        'Daily',
        'Twice a week',
    ]
    const textFieldLabel = "Please specify your consumption";

    const onNext = () => {
        console.log('Next button pressed');
        router.push('/(quiz)/Food6')
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

export default Food5;
