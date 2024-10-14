import React, { FC, useState } from "react";
import { View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { QuestionContainer } from "./QuestionContainer";
import { TemplateProps } from "@/types/QuizProps";
import { Text } from "react-native-paper";
import { PresetChoices } from "./PresetChoices";
import CheckboxChoices from "./Checkbox";

const CheckboxTemplate: FC<TemplateProps> = ({
  category,
  question,
  choices,
  defaultValue,
  onAnswer,
}) => {
  // State to manage selected answers (multiple selections allowed)
  const [selectedAnswers, setSelectedAnswers] =
    useState<string[]>(defaultValue);

  // Function to handle checkbox toggle
  const handlePress = (selected: string) => {
    let updatedAnswers;
    
    if (selectedAnswers.includes(selected)) {
      // Remove answer if already selected
      updatedAnswers = selectedAnswers.filter((item) => item !== selected);
    } else {
      // Add answer if not selected
      updatedAnswers = [...selectedAnswers, selected];
    }
    
    setSelectedAnswers(updatedAnswers);
    onAnswer(updatedAnswers); // Call onAnswer with the updated array
    console.log(updatedAnswers);
  };

  const handleReset = () => {
    setSelectedAnswers([]);
    onAnswer([]); // Call onAnswer with an empty array when reset
  };

  return (
    <QuestionContainer>
      <ThemedText type="defaultSemiBold" className="text-lime-800 mb-3">
        {category}
      </ThemedText>
      <ThemedText type="default" className="text-black text-[20px] mb-3">
        {question}
      </ThemedText>
      <View className="flex-row flex-wrap justify-center mt-10 mb-3">
        <PresetChoices title="None" isSelected={selectedAnswers.length === 0} onPress={handleReset} />
      </View>
      {/* Checkboxes */}
      <View className="flex-row flex-wrap justify-center mt-10 mb-3">
        {choices ? (
          Object.entries(choices).map(([key, value]) => (
            <CheckboxChoices
              key={key}
              title={key}
              isChecked={selectedAnswers.includes(value)}
              onPress={() => handlePress(value)}
            />
          ))
        ) : (
          <Text> Loading... </Text>
        )}
      </View>
    </QuestionContainer>
  );
};

export default CheckboxTemplate;
