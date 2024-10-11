import React, { FC, useState } from "react";
import { View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { QuestionContainer } from "./QuestionContainer";
import { CheckboxChoices } from "./Checkbox";
import { TemplateProps } from "@/types/QuizProps";


const Template4: FC<TemplateProps> = ({
  category,
  question,
  choices,
  defaultValue,
  onAnswer,
}) => {
  // State to manage selected answers (multiple selections allowed)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  // Function to handle checkbox toggle
  const handleCheckboxPress = (answer: string) => {
    if (selectedAnswers.includes(answer)) {
      // Remove answer if already selected
      setSelectedAnswers(selectedAnswers.filter((item) => item !== answer));
    } else {
      // Add answer if not selected
      setSelectedAnswers([...selectedAnswers, answer]);

      // Call the onAnswer callback with the updated selected answers
      onAnswer(answer);
    }
  };

    // Convert choices into an array if it's a Map
    const choicesArray = Array.isArray(choices)
    ? choices
    : choices instanceof Map
    ? Array.from(choices.keys()) // Get keys if it's a Map
    : []; // Default to empty arra

  return (
    // <ThemedView className="flex-1 px-6">
      <QuestionContainer>
        <ThemedText type="defaultSemiBold" className="text-lime-800 mb-3">
          {category}
        </ThemedText>
        <ThemedText type="default" className="text-black text-[20px] mb-3">
          {question}
        </ThemedText>

        {/* Checkboxes */}
        <View className="flex-row flex-wrap justify-center mt-10 mb-3">
          {choicesArray.map((answer: string) => (
            <CheckboxChoices
              key={answer}
              title={answer}
              isChecked={selectedAnswers.includes(answer)}
              onPress={() => handleCheckboxPress(answer)}
            />
          ))}
        </View>
      </QuestionContainer>
    // </ThemedView>
  );
};

export default Template4;
