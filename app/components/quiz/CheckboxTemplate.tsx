import React, { FC, useState } from "react";
import { QuestionContainer } from "./QuestionContainer";
import { TemplateProps } from "@/types/QuizProps";
import { PresetChoices } from "./PresetChoices";
import CheckboxChoices from "./Checkbox";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

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
      <StyledText category="label" className="mb-3 text-sm" style={{ color: myTheme['color-primary-600']}}>
        {category}
      </StyledText>
      <StyledText category="p1" className="text-xl mb-3">
        {question}
      </StyledText>
      <StyledLayout className="flex-row flex-wrap justify-center mt-10 mb-3">
        <PresetChoices title="None" isSelected={selectedAnswers.length === 0} onPress={handleReset} />
      </StyledLayout>
      {/* Checkboxes */}
      <StyledLayout className="flex-row flex-wrap justify-center mt-10 mb-3">
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
          <StyledText> Loading... </StyledText>
        )}
      </StyledLayout>
    </QuestionContainer>
  );
};

export default CheckboxTemplate;
