import React, { FC, useState } from "react";
import { View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { QuestionContainer } from "./QuestionContainer";
import { CheckboxChoices } from "./Checkbox";
import { NavigationButtons } from "./NavigationButtons";
import { TemplateProps } from "@/types/QuizProps";

const Template4: FC<TemplateProps> = ({
  category,
  question,
  choices,
  defaultValue,
  onNext,
  onBack,
  showBackButton = true,
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
    }
  };

  return (
    <ThemedView className="flex-1 px-6">
      <QuestionContainer>
        <ThemedText type="defaultSemiBold" className="text-lime-800 mb-3">
          {category}
        </ThemedText>
        <ThemedText type="default" className="text-black text-[20px] mb-3">
          {question}
        </ThemedText>

        {/* Checkboxes */}
        <View className="flex-row flex-wrap justify-center mt-10 mb-3">
          {answers.map((answer) => (
            <CheckboxChoices
              key={answer}
              title={answer}
              isChecked={selectedAnswers.includes(answer)}
              onPress={() => handleCheckboxPress(answer)}
            />
          ))}
        </View>
      </QuestionContainer>
    </ThemedView>
  );
};

export default Template4;
