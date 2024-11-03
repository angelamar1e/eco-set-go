import React, { FC, useState } from "react";
import { QuestionContainer } from "./QuestionContainer";
import { PresetChoices } from "./PresetChoices";
import { TextField } from "./TextField";
import { TemplateProps } from "@/types/QuizProps";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TipsModal from "./tips";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const InputTemplate: FC<TemplateProps> = ({
  category,
  question,
  choices,
  inputLabel = "",
  defaultValue,
  onAnswer,
  isModalVisible,
  setModalVisible,
  tips,
}) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue || "");

  const handlePress = (value: any) => {
    setInputValue(value);
    onAnswer(value);
  };

  const handleTextChange = (text: string) => {
    setInputValue(text);
  };

  const handleBlur = () => {
    onAnswer(inputValue);
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
              <Ionicons name="information-circle-outline" size={18} style={{ color: myTheme['color-success-700'], top: 2}} />
            </TouchableOpacity>
          )}
        </View>

      <StyledLayout className="flex-row flex-wrap justify-left mb-10">
        {choices ? (
          Object.entries(choices).map(([key, value]) => (
            <PresetChoices
              key={key}
              title={key}
              isSelected={value === defaultValue}
              onPress={() => handlePress(value)}
            />
          ))
        ) : (
          <Text> Loading... </Text>
        )}
      </StyledLayout>

      <StyledLayout className="ml-2 mb-5">
        <TextField
          unit={inputLabel}
          value={inputValue}
          onChangeText={handleTextChange}
          onBlur={handleBlur}            
        />
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

export default InputTemplate;
