import React, { useState } from 'react'; 
import { Template3 } from '../components/quiz/Template3';
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const Electricity2 = () => {
    const router = useRouter();

    const category = "Electricity";
    const question = "Does your home have solar panels installed?";
    const answers = [
        'Yes',
        'No',
        ];
    const onNext = () => {
        console.log('Next button pressed');
        router.push('/(quiz)/Electricity3');
        };

    const onBack = () => {
        console.log('Back button pressed');
        router.back(); 
    };

    return (
        <ThemedView className="flex-1 px-4">
            <ScrollView>
                <Template3
                    category={category}
                    question={question}
                    answer={answers}
                    onNext={onNext}
                    onBack={onBack}
                    showBackButton={true}
                />
            </ScrollView>
        </ThemedView>
    );
};

export default Electricity2;