import { useState, FC, useEffect } from "react";
import { View } from "react-native";
import { QuestionContainer } from "@/app/components/quiz/QuestionContainer";
import { ThemedText } from "@/components/ThemedText";
import { RadioChoices } from "@/app/components/quiz/RadioChoices";
import { Text } from "react-native-paper";
import { TemplateProps } from "@/types/QuizProps";

export const Template2: FC<TemplateProps> = ({
  category,
  question,
  choices = {},
  defaultValue,
  onAnswer
}) => {
  // gets the first choice that matches the defaultValue
  const getDefaultIndex = () => {
    const defaultIndex = Object.entries(choices).findIndex(
      ([, value]) => value === defaultValue
    );
    return defaultIndex !== -1 ? defaultIndex : null;
  };

  // declares selectedIndex, sets initial values using getDefaultIndex
  const [selectedIndex, setSelectedIndex] = useState<number | null>(getDefaultIndex());

  // dynamically updates selectedIndex when defaultValue or choices change
  useEffect(() => {
    if (defaultValue) {
      const defaultIndex = getDefaultIndex();
      setSelectedIndex(defaultIndex);
    }
  }, [defaultValue, choices]);

  const handlePress = (index: number, value: string | number) => {
    setSelectedIndex(index);  // Set the index as the selected one
    onAnswer(value);          // Send the selected value to the callback
    console.log("Selected Answer: ", value); // Log the selected answer
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
            Object.entries(choices).map(([key, value], index) => (
              <RadioChoices
                key={index} 
                title={key}
                isSelected={selectedIndex === index}
                onPress={() => handlePress(index, value as string | number)}
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
