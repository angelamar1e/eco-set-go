import { useState, FC } from "react";
import { View } from "react-native";
import { QuestionContainer } from "@/app/components/quiz/QuestionContainer";
import { NavigationButtons } from "@/app/components/quiz/NavigationButtons";
import { ThemedText } from "@/components/ThemedText";
import { RadioChoices } from "@/app/components/quiz/RadioChoices";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "react-native-paper";

interface Template3BaseProps {
  category: string;
  question: string;
  onNext: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  onAnswer: (answer: string | number) => void;
}

interface stringChoiceValues extends Template3BaseProps {
  choices: Map<string, string>;
  defaultValue: string;
}

interface numberChoiceValues extends Template3BaseProps {
  choices: Map<string, number>;
  defaultValue: number;
}

type Template3Props = stringChoiceValues | numberChoiceValues;

export const Template3: FC<Template3Props> = ({
  category,
  question,
  choices,
  defaultValue,
  onNext,
  onBack,
  showBackButton = true,
  onAnswer
}) => {
  const [answer, setAnswer] = useState<string | number>();

  const handlePress = (answer: string | number) => {
    setAnswer(answer);
    onAnswer(answer);
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

        {/* Radio Choices */}
        <View className="flex-wrap flex-row justify-center mt-10 mb-3">
          {choices ? (
            Object.entries(choices).map(([key, value]) => (
              <RadioChoices
                key={key}
                title={key}
                isSelected={answer ? answer === value : value === defaultValue}
                onPress={() => handlePress(value)}
              />
            ))
          ) : (
            <Text> Loading... </Text>
          )}
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
