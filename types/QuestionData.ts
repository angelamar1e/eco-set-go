export interface QuestionData {
    variable: string;
    question: string;
    choices?: Map<string, string> & Map<string, number>;
    category: string;
    default_value: string | number | boolean;
    input_label?: string;
    template: number;
    stepperTitles?: string[];
    checkboxes?: string[];
}