import React, { FC, useState, useEffect } from "react";
import { View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { QuestionContainer } from "./QuestionContainer";
import { PresetChoices } from "./PresetChoices";
import Stepper from "./Stepper";
import { StepperTemplateProps } from "@/types/QuizProps";
import { Text } from "react-native-paper";

const StepperTemplate: FC<StepperTemplateProps> = ({
  category,
  question,
  choices,
  defaultValue,
  steppers,
  onAnswer,
}) => {
  // State to manage the selected answer
  const [answer, setAnswer] = useState<any>(defaultValue);

  useEffect(() => {
    onAnswer(answer);
  }, [answer]); // This will run whenever `answer` is updated

  // Function to handle answer selection
  const handlePress = (answer: any) => {
    setAnswer(answer); // State update when a preset is selected
  };

  // Handle stepper value changes
  const handleStepperChange = (key: string, value: number) => {
    setAnswer((prevAnswer: any) => ({
      ...prevAnswer,
      [key]: value // Update the answer state dynamically based on the key
    }));
  };

  return (
      <QuestionContainer>
        <ThemedText type="defaultSemiBold" className="text-lime-800 mb-3">
          {category}
        </ThemedText>
        <ThemedText type="default" className="text-black text-[20px] mb-3">
          {question}
        </ThemedText>

        {/* Presets */}
        <View className="flex-row flex-wrap justify-left mb-3">
          {choices ? (
            Object.entries(choices).map(([key, value]) => (
              <PresetChoices
                key={key}
                title={key}
                isSelected={value === answer}
                onPress={() => handlePress(value)}
              />
            ))
          ) : (
            <Text> Loading... </Text>
          )}
        </View>

        {/* Stepper */}
        <View className="mt-5 mb-5 justify-center mt-10 mb-3">
          {steppers ? (
            Object.entries(steppers).map(([key, value]) => (
              <Stepper
                key={key}
                title={key}
                frequency={answer[key] || value} // Reflect the current answer value or the default
                onChange={(value) => handleStepperChange(key, value)}
              />
            ))
          ) : (
            <Text> Loading... </Text>
          )}
        </View>
      </QuestionContainer>
  );
};

export default StepperTemplate;
