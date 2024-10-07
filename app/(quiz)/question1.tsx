import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
import { SuggestedAnswers } from "../components/quiz/SuggestedAnswers";
import { QuestionContainer } from "../components/quiz/QuestionContainer";
import { Text, TextInput } from "react-native-paper";
import Calculator from "../components/quiz/Calculator";
import { Link } from "expo-router";

const Question1 = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [numericValue, setNumericValue] = useState<number>(0);

  const handleBlur = () => {
    convertInput(inputValue);
  };

  useEffect(() => {
    convertInput(inputValue);
  }, [inputValue]);

  const convertInput = (text: string) => {
    if (/^\d*$/.test(text) || text === "") {
      const newValue = text === "" ? 0 : parseFloat(text);
      setNumericValue(newValue);
    }
  };

  const handlePress = (choice: string) => {
    setSelectedAnswer(choice);

    const newInputValue = getInputValue(choice);
    setInputValue(newInputValue);
    convertInput(newInputValue);
  };

  const getInputValue = (choice: string) => {
    switch (choice) {
      case "Zero":
        return "0";
      case "Vacations":
        return "1000";
      case "10km / day":
        return "3650";
      case "1000km / month":
        return "12000";
      case "20 000km / year":
        return "20000";
      default:
        return "0";
    }
  };

  const choices = [
    "Zero",
    "Vacations",
    "10km / day",
    "1000km / month",
    "20 000km / year",
  ];

  return (
    <ThemedView className="flex-1">
      <ScrollView>
        <Calculator value={numericValue * 0.21} />
        <QuestionContainer>
          <Text>How far do you travel per year by car?</Text>
        </QuestionContainer>

        <View className="flex-row flex-wrap justify-between mb-3">
          {choices.map((choice) => (
            <SuggestedAnswers
              key={choice}
              title={choice}
              isSelected={selectedAnswer === choice}
              onPress={() => handlePress(choice)}
            />
          ))}
        </View>

        <TextInput
          mode="flat"
          placeholder="0"
          keyboardType="numeric"
          outlineColor="green"
          activeOutlineColor="green"
          onChangeText={setInputValue}
          onBlur={handleBlur}
          value={inputValue}
          className="m-3"
        />
        <Text className="m-3">km / year</Text>

        <Link href="/(quiz)/" className="text-blue-600 text-right mr-5"> → Go to questions templates</Link>
      </ScrollView>
    </ThemedView>
  );
};

export default Question1;
