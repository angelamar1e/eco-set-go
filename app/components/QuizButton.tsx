import React from 'react';
import { Button } from 'react-native-paper';
import { styled } from "nativewind";
import { ThemedText } from '@/components/ThemedText';
import { router } from "expo-router";

const StyledButton = styled(Button);

const QuizButton = () => {
  
  // Function to handle button press
  const handleQuizPress = () => {
    router.push("(quiz)");
  };

  return (
    <StyledButton
      onPress={handleQuizPress}
      mode='contained'
      className='rounded-[25px] bg-lime-800 absolute bottom-5 left-6'
    >
      <ThemedText type='default' className='text-stone-300'>
        Start Quiz
      </ThemedText>
    </StyledButton>
  );
};

export default QuizButton;
