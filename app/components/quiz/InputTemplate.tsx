import React, { FC, useState } from "react";
import { QuestionContainer } from "./QuestionContainer";
import { PresetChoices } from "./PresetChoices";
import { TextField } from "./TextField";
import { TemplateProps } from "@/types/QuizProps";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const InputTemplate: FC<TemplateProps> = ({
  category,
  question,
  choices: choices,
  inputLabel = "",
  defaultValue,
  onAnswer
}) => {
  // State to manage selected answer from preset choices
  const [answer, setAnswer] = useState<number>(defaultValue);

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
    // Check if the text only contains numbers and is positive
    if (/^\d*$/.test(text) && text !== '0') {
      setInputValue(text);
    }
  };

  const handleBlur = () => {
    onAnswer(parseInt(inputValue));
  };

  return (
      <QuestionContainer>
        <StyledText category="label" className="mb-3 text-sm" style={{ color: myTheme['color-success-700']}}>
        {category}
        </StyledText>
        <StyledText category="p1" className="text-xl mb-3">
          {question}
        </StyledText>

        <StyledLayout className="flex-row flex-wrap justify-left mb-10">
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

        {/* Input field */}
        <StyledLayout className="ml-2 mb-5">
          <TextField
            unit={inputLabel}
            value={inputValue}
            onChangeText={handleTextChange}
            onBlur={handleBlur}            
          />
        </StyledLayout>
      </QuestionContainer>
  );
};

export default InputTemplate;