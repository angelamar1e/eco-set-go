import React, { FC, useState, useEffect } from "react";
import { QuestionContainer } from "./QuestionContainer";
import { PresetChoices } from "./PresetChoices";
import Stepper from "./Stepper";
import { StepperTemplateProps } from "@/types/QuizProps";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TipsModal from "./tips";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const StepperTemplate: FC<StepperTemplateProps> = ({
  category,
  question,
  choices,
  defaultValue,
  steppers,
  onAnswer,
  isModalVisible,
  setModalVisible,
  tips,
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
        <StyledText className="text-sm mb-3" style={{ color: myTheme['color-success-700'], fontFamily: 'Poppins-Medium' }}>
          {category}
        </StyledText>

        <StyledText className="mb-3" style={{ fontFamily: 'Poppins-SemiBold', fontSize: 19, alignItems: 'center' }}>
          {question} {tips && (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="information-circle-outline" size={22} style={{ color: myTheme['color-success-700'], top: 5}} />
            </TouchableOpacity>
          )}
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

        {tips && tips.length > 0 && (
          <TipsModal
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
            tips={tips}
          />
        )}
      </QuestionContainer>
  );
};

export default StepperTemplate;