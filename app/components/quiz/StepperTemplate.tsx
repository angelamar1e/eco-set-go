import React, { FC, useState } from "react";
import { View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { QuestionContainer } from "./QuestionContainer";
import { PresetChoices } from "./PresetChoices";
import Stepper from "./Stepper";
import { NavigationButtons } from "./NavigationButtons";
import { StepperTemplateProps, TemplateProps } from "@/types/QuizProps";
import { Text } from "react-native-paper";

const StepperTemplate: FC<StepperTemplateProps> = ({
  category,
  question,
  choices,
  stepperTitle,
}) => {
  // State to manage the selected answer
  const [answer, setAnswer] = useState<any>();

  // State to manage the stepper values as an array
  const [stepperValues, setStepperValues] = useState<number[]>(
    new Array(stepperTitle?.length).fill(0)
  );

  // Function to handle answer selection
  const handlePress = (answer: any) => {
    setAnswer(answer);
  };

  // Handle stepper value changes
  const handleStepperChange = (type: string, value: number) => {
    const updatedValues = [...stepperValues];
    updatedValues[index] = value;
    setStepperValues(updatedValues);
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
          {stepperTitle ? (
            Object.entries(stepperTitle).map(([key, value]) => (
              <Stepper
                key={key}
                title={key}
                value={value}
                onChange={(value) => handleStepperChange(key, value)} // Pass the index
              />
            ))
          ) : (
            <Text> Loading... </Text>
          )}
        </View>
      </QuestionContainer>
    </ThemedView>
  );
};

export default StepperTemplate;
