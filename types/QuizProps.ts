export interface QuizProps {
    question: string; // The question as a string
    choices?: Map<string, number>; // The choices as a Map
}