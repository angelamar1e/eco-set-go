export interface QuestionProps {
    question: string; // The question as a string
    choices?: Map<string, string> | Map<string, number>; // The choices as a Map
}

export interface TemplateProps {
    category: string;
    textFieldLabel?: string;
    question: string;
    choices?: Map<string, string> | Map<string, number>;
    defaultValue: string | number;
    onNext: () => void;
    onBack?: () => void;
    onAnswer: (answer: string | number) => void;
    showBackButton?: boolean;
}

export interface StepperProps extends TemplateProps {
    stepperTitle: string[];
    stepperInitialValue: number;
} 

export interface CheckboxProps extends TemplateProps {
    checkboxes: string[];
}