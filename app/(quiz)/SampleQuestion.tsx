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
        
    /* Template3
    const question="Question"
    const answer=['Answer1']
    const navigationNext= "Next";
    const navigationPrevious= "Previous";
    
    const handleNavigationPress = () => {
        console.log("Navigating to the next question...");
    };

    return (
        <Template3
        question={question}
        answer={answer}
        navigationNext={navigationNext}
        navigationPrevious={navigationPrevious}
        onNavigationPress={handleNavigationPress}
        />

    /* Template 4
        const question2 = "Choose your favorite features";
        const answers2 = ['Feature A', 'Feature B', 'Feature C', 'Feature D'];
        const navigationButtonTitle = "Next";


    return (
            <Template4
                question={question2}
                answers={answers2}
                navigationButtonTitle={navigationButtonTitle}
                onNavigationPress={handleNavigationPress}
            />
    
        Template 5
        const question = "What's your choice?";
        const answers = ['Option A', 'Option B', 'Option C', 'Option D'];
        const stepperTitle = "Quantity";
        const stepperInitialValue = 0;
        const navigationButtonTitle = "Next";
    
    return (
        <Template5
            question={question}
            answers={answers}
            stepperTitle={stepperTitle}
            stepperInitialValue={stepperInitialValue}
            navigationButtonTitle={navigationButtonTitle}
            onNavigationPress={handleNavigationPress}
        />

        Template 6
        const question = "What are your preferences?";
        const answers = ['None'];
        const checkboxes = ['Check 1', 'Check 2', 'Check 3'];
        const navigationButtonTitle = "Next";

    return (
        <Template6
            question={question}
            answers={answers}
            checkboxes={checkboxes}
            navigationButtonTitle={navigationButtonTitle}
            onNavigationPress={handleNavigationPress}
        />
        */
    );
};

export default ExamplePage;
