import { CheckboxProps } from "react-native-paper";

export interface QuestionProps {
    question: string; // The question as a string
    choices?: Map<string, string> | Map<string, number>; // The choices as a Map
}

export interface TemplateProps {
    category: string;
    inputLabel?: string;
    question: string;
    choices?: Map<string, string> | Map<string, number>;
    defaultValue: string | number | boolean;
    onAnswer: (answer: string | number) => void;
}

export interface StepperProps extends TemplateProps {
    stepperTitle?: string[];
} 

export interface CheckboxesProps extends TemplateProps {
    checkboxes?: string[];
}