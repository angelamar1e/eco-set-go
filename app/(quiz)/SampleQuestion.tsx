import React, { useState } from 'react';
import Template2 from '../components/quiz/Template2';
import {Template3} from '../components/quiz/Template3';
import Template4 from '../components/quiz/Template4';
import Template5 from '../components/quiz/Template5';
import Template6 from '../components/quiz/Template6';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';

const ExamplePage = () => {
    // Template 2 states and handlers
    const question2 = "Capstone 2 defended?";
    const answers2 = ['YES', 'SYEMPRE, YES', 'TRUE DA FIRE', 'OMSIM'];
    const textFieldLabel2 = "Baka may gusto ka sabihin";
    const navigationButtonTitle2 = "Next";
    const handleNavigationPress2 = () => {
        console.log("Navigating from Template 2...");
    };

    // Template 3 states and handlers
    const question3 = "What kind of breakfast do you usually eat?";
    const answer3 = [
        'Bread and pastries',
        'Salty',
        'Filipino Breakfast',
        'Fruit',
        'No Breakfast',
    ];
    const navigationNext3 = "Next";
    const navigationPrevious3 = "Previous";
    const handleNavigationPress3 = () => {
        console.log("Navigating from Template 3...");
    };

    // Template 4 states and handlers
    const question4 = "Choose your favorite features";
    const answers4 = ['Feature A', 'Feature B', 'Feature C', 'Feature D'];
    const navigationButtonTitle4 = "Next";
    const handleNavigationPress4 = () => {
        console.log("Navigating from Template 4...");
    };

    // Template 5 states and handlers
    const question5 = "What's your choice?";
    const answers5 = ['Option A', 'Option B', 'Option C', 'Option D'];
    const stepperTitle5 = "Quantity";
    const stepperInitialValue5 = 0;
    const navigationButtonTitle5 = "Next";
    const handleNavigationPress5 = () => {
        console.log("Navigating from Template 5...");
    };

    // Template 6 states and handlers
    const question6 = "What are your preferences?";
    const answers6 = ['None'];
    const checkboxes6 = ['Check 1', 'Check 2', 'Check 3'];
    const navigationButtonTitle6 = "Next";
    const handleNavigationPress6 = () => {
        console.log("Navigating from Template 6...");
    };

    return (
        <ThemedView className='flex-1'>
            <ScrollView>
            {/* Template 2 */}
            <Template2
                question={question2}
                answers={answers2}
                textFieldLabel={textFieldLabel2}
                navigationButtonTitle={navigationButtonTitle2}
                onNavigationPress={handleNavigationPress2}
            />

            {/* Template 3 */}
            <Template3
                question={question3}
                answer={answer3}
                navigationNext={navigationNext3}
                navigationPrevious={navigationPrevious3}
                onNavigationPress={handleNavigationPress3}
            />

            {/* Template 4 */}
            <Template4
                question={question4}
                answers={answers4}
                navigationButtonTitle={navigationButtonTitle4}
                onNavigationPress={handleNavigationPress4}
            />

            {/* Template 5 */}
            <Template5
                question={question5}
                answers={answers5}
                stepperTitle={stepperTitle5}
                stepperInitialValue={stepperInitialValue5}
                navigationButtonTitle={navigationButtonTitle5}
                onNavigationPress={handleNavigationPress5}
            />

            {/* Template 6 */}
            <Template6
                question={question6}
                answers={answers6}
                checkboxes={checkboxes6}
                navigationButtonTitle={navigationButtonTitle6}
                onNavigationPress={handleNavigationPress6}
            />
            </ScrollView>
        </ThemedView>
    );
};

export default ExamplePage;
