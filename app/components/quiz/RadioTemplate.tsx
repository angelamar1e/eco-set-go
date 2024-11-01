import { useState, FC } from "react";
import { QuestionContainer } from "@/app/components/quiz/QuestionContainer";
import { RadioChoices } from "@/app/components/quiz/RadioChoices";
import { TemplateProps } from "@/types/QuizProps";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const RadioTemplate: FC<TemplateProps> = ({
  category,
  question,
  choices,
  defaultValue,
  onAnswer
}) => {
  const [answer, setAnswer] = useState<string | number | boolean>(defaultValue);
  const [answerText, setAnswerText] = useState<string>("");

  const handlePress = (title: string, selected: string | number) => {
    setAnswer(selected);
    setAnswerText(title);
    onAnswer(selected);
  };

  return (
      <QuestionContainer>
        <StyledText category="label" className="mb-3 text-sm" style={{ color: myTheme['color-primary-600']}}>
          {category}
        </StyledText>
        <StyledText category="p1" className="text-xl mb-3">
          {question}
        </StyledText>

        {/* Radio Choices */}
        <StyledLayout className="flex-wrap flex-row justify-center mt-10 mb-3">
          {choices ? (
            Object.entries(choices).map(([key, value]) => (
              <RadioChoices
                key={key}
                title={key}
                isSelected={key === answerText}
                onPress={() => handlePress(key, value)}
              />
            ))
          ) : (
            <Text> Loading... </Text>
          )}
        </StyledLayout>
      </QuestionContainer>
  );
};

export default RadioTemplate;
