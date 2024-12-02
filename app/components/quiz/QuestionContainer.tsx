import React from 'react';
import { styled } from 'nativewind';
import { Card } from '@ui-kitten/components';
import { myTheme } from '@/constants/custom-theme';

const StyledCard = styled(Card);

interface QuestionContainerProps {
  children: React.ReactNode;
}

export const QuestionContainer: React.FC<QuestionContainerProps> = ({ children }) => {
  return (
    <StyledCard className="mt-1 mb-2 rounded-xl px-1" style={{ borderWidth: 1, elevation: 2, borderColor: myTheme['color-success-900']}}>
      {children}
    </StyledCard>
  );
};