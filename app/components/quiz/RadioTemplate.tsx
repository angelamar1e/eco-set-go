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

  const handlePress = (selectedKey: string, selectedText: string, selectedValue: any) => {
    setAnswer(selectedKey);
    setAnswerText(selectedText);
    onAnswer(selectedValue);
  };

  return (
    <QuestionContainer>
      <StyledText 
        className="mb-3" 
        style={{ 
          fontFamily: 'Poppins-Medium',
          fontSize: 14,
          color: myTheme['color-success-700']
        }}
      >
        {category}
      </StyledText>

      <View className="flex-row justify-between items-center mb-2">
        <StyledText 
          style={{ 
            fontFamily: 'Poppins-SemiBold',
            fontSize: 16,
            flex: 1,
            marginRight: 8,
            color: myTheme['color-basic-800']
          }}
        >
          {question}
        </StyledText>
        {tips && tips.length > 0 && (
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            className="p-1"
          >
            <Ionicons 
              name="information-circle-outline" 
              size={22} 
              style={{ color: myTheme['color-success-700'] }} 
            />
          </TouchableOpacity>
        )}
      </View>

      <StyledLayout className="flex-wrap flex-row justify-center mt-2">
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
          <StyledText 
            style={{ 
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              color: myTheme['color-basic-600']
            }}
          >
            Loading...
          </StyledText>
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