import { useState, FC } from "react";
import { QuestionContainer } from "@/app/components/quiz/QuestionContainer";
import { RadioChoices } from "@/app/components/quiz/RadioChoices";
import { TemplateProps } from "@/types/QuizProps";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import TipsModal from "./tips";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const RadioTemplate: FC<TemplateProps> = ({
  category,
  question,
  choices,
  defaultValue,
  onAnswer,
  isModalVisible,
  setModalVisible,
  tips,
}) => {
  const [answer, setAnswer] = useState<string | number | boolean>(defaultValue);
  const [answerText, setAnswerText] = useState<string>("");

  const handlePress = (selectedKey: string, selectedText: string, selectedValue: string) => {
    setAnswer(selectedKey); 
    setAnswerText(selectedText); 
    onAnswer(selectedValue); 
  };

  return (
      <QuestionContainer>
        <StyledText className="text-sm mb-3" style={{ color: myTheme['color-success-700'], fontFamily: 'Poppins-Medium' }}>
          {category}
        </StyledText>

        <View className="flex-row justify-between">
          <StyledText className='' style={{ fontFamily: 'Poppins-SemiBold', fontSize: 19, alignItems: 'center' }}>
            {question} 
          </StyledText>
          {tips && tips.length > 0 && (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="information-circle-outline" size={22} style={{ color: myTheme['color-success-700'], top: 2}} />
            </TouchableOpacity>
          )}
        </View>

        <StyledLayout className="flex-wrap flex-row justify-center mt-10 mb-3">
        {choices ? (
          Object.entries(choices).map(([key, { text, value, example, choices_tip }]) => (
            <RadioChoices
              key={key}
              title={text}
              example={example}
              choices_tip={choices_tip}
              isSelected={answer === key}
              onPress={() => handlePress(key, text, value)}
            />
          ))
        ) : (
          <Text>Loading...</Text>
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

export default RadioTemplate;