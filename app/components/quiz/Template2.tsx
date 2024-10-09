import React, { FC, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { QuestionContainer } from "./QuestionContainer";
import { PresetChoices } from "./PresetChoices";
import { TextField } from "./TextField";
import { NavigationButtons } from "./NavigationButtons";
import { TemplateProps } from "@/types/QuizProps";

export const Template2: FC<TemplateProps> = ({
  category,
  question,
  choices: choices,
  textFieldLabel,
  defaultValue,
  onNext,
  onBack,
  showBackButton = true,
  onAnswer
}) => {
  // State to manage selected answer from preset choices
  const [answer, setAnswer] = useState<number>();

  // State to manage the input value in the TextField
  const [inputValue, setInputValue] = useState<string>(defaultValue.toString());

  // Function to handle answer selection
  const handlePress = (answer: number) => {
    setAnswer(answer);
    setInputValue(answer.toString());
    onAnswer(answer);
  };

  // Function to handle text input change
  const handleTextChange = (text: string) => {
    setInputValue(text);
  };

  const handleBlur = () => {
    onAnswer(parseInt(inputValue));
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

        <View className="flex-row flex-wrap justify-left mb-10">
          {choices ? (
            Object.entries(choices).map(([key, value]) => (
              <PresetChoices
                key={key}
                title={key}
                isSelected={answer || answer == 0 ? answer === value : value === defaultValue}
                onPress={() => handlePress(value)}
              />
            ))
          ) : (
            <Text> Loading... </Text>
          )}
        </View>

        {/* Text Input Field */}
        <View className="ml-2 mb-5">
          <TextField
            label={textFieldLabel}
            value={inputValue}
            onChangeText={handleTextChange}
            onBlur={handleBlur}
          />
        </View>

        {/* Navigation Button */}
        <View className="flex-row justify-center mt-4">
          {showBackButton && (
            <NavigationButtons
              title="Back"
              variant="secondary"
              onPress={onBack}
            />
          )}
          <NavigationButtons
            title="Next"
            variant="primary"
            onPress={() => {
              console.log("Next button pressed");
              onNext();
            }}
          />
        </View>
      </QuestionContainer>
    </ThemedView>
  );
};

export default Template2;
