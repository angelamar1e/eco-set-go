import React, { FC, useState } from "react";
import { QuestionContainer } from "./QuestionContainer";
import { TemplateProps } from "@/types/QuizProps";
import { PresetChoices } from "./PresetChoices";
import CheckboxChoices from "./Checkbox";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TipsModal from "./tips";
import { View } from "react-native";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const CheckboxTemplate: FC<TemplateProps> = ({
  category,
  question,
  choices,
  defaultValue,
  onAnswer,
  isModalVisible,
  setModalVisible,
  tips,
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
        <StyledText className="text-sm mb-3" style={{ color: myTheme['color-success-700'], fontFamily: 'Poppins-Medium' }}>
          {category}
        </StyledText>
        <View className="flex-row justify-between">
          <StyledText className="mb-3" style={{ fontFamily: 'Poppins-SemiBold', fontSize: 19, alignItems: 'center' }}>
            {question} 
          </StyledText>
          {tips && tips.length > 0 && (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="information-circle-outline" size={22} style={{ color: myTheme['color-success-700'], top: 2}} />
            </TouchableOpacity>
          )}
        </View>

      <StyledLayout className="flex-row flex-wrap justify-center">
        <PresetChoices title="None" isSelected={selectedAnswers.length === 0} onPress={handleReset} />
      </StyledLayout>
      {/* Checkboxes */}
      <StyledLayout className="flex-row flex-wrap justify-center mt-10 mb-3">
        {choices ? (
          Object.entries(choices).map(([key, { text, value, example }]) => (
            <CheckboxChoices
              key={key}
              title={text}
              example={example}
              isChecked={selectedAnswers.includes(value)}
              onPress={() => handlePress(value)}
            />
          ))
        ) : (
          <StyledText> Loading... </StyledText>
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

export default CheckboxTemplate;