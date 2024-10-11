export interface QuestionProps {
    question: string; // The question as a string
    choices?: Map<string, string> | Map<string, number>; // The choices as a Map
}

export interface TemplateProps {
    category: string;
    textFieldLabel?: string;
    question: string;
    question2?: string;
    choices?: Map<string, string> | Map<string, number> | string[];
    defaultValue: string | number | boolean;
    onAnswer: (answer: string | number) => void;
    showBackButton?: boolean;
    unit: string;
}

export interface StepperProps extends TemplateProps {
    stepperTitle: string[];
    stepperInitialValue: number;
} 

export interface CheckboxProps extends TemplateProps {
    checkboxes: string[];
}