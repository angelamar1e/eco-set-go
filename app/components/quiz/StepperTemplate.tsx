import React, { FC, useState, useEffect } from "react";
import { QuestionContainer } from "./QuestionContainer";
import { PresetChoices } from "./PresetChoices";
import Stepper from "./Stepper";
import { StepperTemplateProps } from "@/types/QuizProps";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

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
        <StyledText category="label" className="mb-3 text-sm" style={{ color: myTheme['color-primary-600']}}>
          {category}
        </StyledText>
        <StyledText category="p1" className="text-xl mb-3">
         {question}
        </StyledText>

        {/* Presets */}
        <StyledLayout className="flex-row flex-wrap justify-left mb-3">
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
        </StyledLayout>

        {/* Stepper */}
        <StyledLayout className="mb-5 justify-center">
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
        </StyledLayout>
      </QuestionContainer>
  );
};

export default StepperTemplate;
