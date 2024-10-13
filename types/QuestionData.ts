export interface QuestionData {
    variable: string;
    question: string;
    choices?: any;
    category: string;
    input_label?: string;
    template: number;
    stepper_titles?: Map<string,number>;
}