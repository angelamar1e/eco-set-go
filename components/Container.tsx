import React from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';

const StyledContainer = styled(View);

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <StyledContainer className="mb-4 p-1 rounded-lg overflow-hidden">
      {children}
    </StyledContainer>
  );
};
