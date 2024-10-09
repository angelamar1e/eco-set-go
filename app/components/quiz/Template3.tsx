import { useState, FC } from "react";
import { View } from "react-native";
import { QuestionContainer } from "@/app/components/quiz/QuestionContainer";
import { NavigationButtons } from "@/app/components/quiz/NavigationButtons";
import { ThemedText } from "@/components/ThemedText";
import { RadioChoices } from "@/app/components/quiz/RadioChoices";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "react-native-paper";
import { TemplateProps } from "@/types/QuizProps";

export const Template3: FC<TemplateProps> = ({
  category,
  question,
  choices,
  defaultValue,
  onNext,
  onBack,
  showBackButton = true,
  onAnswer
}) => {
  const [answer, setAnswer] = useState<string | number | boolean>(defaultValue);

  const handlePress = (selected: string | number) => {
    setAnswer(selected);
    onAnswer(selected);
  };

  return (
    // <ThemedView className="flex-1 px-6">
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
                isSelected={answer === value}
                onPress={() => handlePress(value)}
              />
            ))
          ) : (
            <Text> Loading... </Text>
          )}
        </View>
      </QuestionContainer>
    // </ThemedView>
  );
};
