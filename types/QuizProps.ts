export interface TemplateProps {
    category: string;
    inputLabel?: string;
    question: string;
    choices?: Map<string, string> | Map<string, number>;
    defaultValue: any
    onAnswer: (answer: any) => void;
    isModalVisible: boolean;        // Assuming it's a boolean
    setModalVisible: (visible: boolean) => void; // Assuming it's a function to set the modal visibility
    tips: string[]; 
}

export interface StepperTemplateProps extends TemplateProps {
    steppers?: Map<string, number>;
}