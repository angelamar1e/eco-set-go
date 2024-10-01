import React from 'react';
import Template2 from '../components/quiz/Template2';

const ExamplePage = () => {
    const question = "Capstone 2 defended?";
    const answers = ['YES', 'SYEMPRE, YES', 'TRUE DA FIRE', 'OMSIM'];
    const textFieldLabel = "Baka may gusto ka sabihin";
    const navigationButtonTitle = "Next";

    const handleNavigationPress = () => {
        console.log("Navigating to the next question...");
    };

    return (
        <Template2
            question={question}
            answers={answers}
            textFieldLabel={textFieldLabel}
            navigationButtonTitle={navigationButtonTitle}
            onNavigationPress={handleNavigationPress}
        />
    );
};

export default ExamplePage;
