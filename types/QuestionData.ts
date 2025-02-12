export interface QuestionData {
    variable: string;
    question: string;
    choices?: any;
    category: string;
    input_label?: string;
    template: number;
    steppers?: Map<string,number>;
    image?: string;
    tips?: string;
}