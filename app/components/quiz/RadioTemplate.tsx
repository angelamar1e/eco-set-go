import { useState, FC } from "react";
import { QuestionContainer } from "@/app/components/quiz/QuestionContainer";
import { RadioChoices } from "@/app/components/quiz/RadioChoices";
import { TemplateProps } from "@/types/QuizProps";
import { styled } from "nativewind";
import { Layout, Text } from "@ui-kitten/components";
import { myTheme } from "@/constants/custom-theme";
import TipsModal from "./tips";
import { TouchableOpacity, View } from "react-native";
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

  const handlePress = (title: string, selected: string | number) => {
    setAnswer(selected);
    setAnswerText(title);
    onAnswer(selected);
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
