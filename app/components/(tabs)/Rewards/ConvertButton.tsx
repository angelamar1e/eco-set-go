import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledButton = styled(Button);
const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const ConvertButton = () => {
  return (
      <StyledButton 
      className="p-1 m-1 h-1/2 rounded-full"
      size="small"
      status="success" 
      onPress={() => {}}>
        <StyledText category="s1">
          Convert
        </StyledText>
      </StyledButton>
  );
};

export default ConvertButton;
