import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';

const StyledContainer = styled(View);

interface QuestionContainerProps {
  children: React.ReactNode;
}

export const QuestionContainer: React.FC<QuestionContainerProps> = ({ children }) => {
  return (
    <StyledContainer className="bg-gray-100 p-4 mt-4 mb-2 rounded-[25px]">
      {children}
    </StyledContainer>
  );
};
