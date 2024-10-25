import React, { useState } from 'react';
import { Button, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledButton = styled(Button);
const StyledText = styled(Text);

const ConvertButton = () => {
  const [isGoalSet, setIsGoalSet] = useState(false);

  const handleSetGoal = () => {
    setIsGoalSet((prev) => !prev); 
  };

  return (
    <StyledButton
      onPress={handleSetGoal}
      className="rounded-full m-1 py-2 px-3"
      size="small"
      appearance={isGoalSet ? "filled" : "outline"} 
      status={isGoalSet ? "success" : "basic"} 
    >
      <StyledText category="s1">
        {isGoalSet ? 'Converted' : 'Convert'} 
      </StyledText>
    </StyledButton>
  );
};

export default ConvertButton;
