export interface TemplateProps {
    category: string;
    inputLabel?: string;
    question: string;
    choices?: Map<string, string> | Map<string, number>;
    defaultValue: any
    onAnswer: (answer: string | number | string[]) => void;
}

export interface StepperTemplateProps extends TemplateProps {
    stepperTitle?: number[];
}