import React, { useState } from 'react';
import { Button, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { myTheme } from '@/constants/custom-theme';
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
      className="rounded-full m-0 p-0"
    >
      <StyledText className='text-xs'>
        {isGoalSet ? 'Converted' : 'Convert'} 
      </StyledText>
    </StyledButton>
  );
};

export default ConvertButton;
