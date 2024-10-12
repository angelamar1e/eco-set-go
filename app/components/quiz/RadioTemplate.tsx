import { useState, FC, useEffect } from "react";
import { View } from "react-native";
import { QuestionContainer } from "@/app/components/quiz/QuestionContainer";
import { NavigationButtons } from "@/app/components/quiz/NavigationButtons";
import { ThemedText } from "@/components/ThemedText";
import { RadioChoices } from "@/app/components/quiz/RadioChoices";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "react-native-paper";
import { TemplateProps } from "@/types/QuizProps";

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
        <ThemedText type="defaultSemiBold" className="text-lime-800 mb-3">
          {category}
        </ThemedText>
        <ThemedText type="default" className="text-black text-[20px] mb-3">
          {question}
        </ThemedText>

        {/* Radio Choices */}
        <View className="flex-wrap flex-row justify-center mt-10 mb-3">
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
        </View>
      </QuestionContainer>
  );
};

export default RadioTemplate;