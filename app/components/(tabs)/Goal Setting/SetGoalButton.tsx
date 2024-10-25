import React from 'react';
import { Button, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { TouchableOpacity } from 'react-native';

const StyledButton = styled(Button);
const StyledText = styled(Text)

const SetGoalButton = () => {
  const [isGoalSet, setIsGoalSet] = React.useState(false);

  const handleSetGoal = () => {
    setIsGoalSet(!isGoalSet);  
  };

  return (
    <TouchableOpacity className="ml-auto mr-5">
      <StyledButton
        onPress={handleSetGoal}
        className="rounded-full p-1"
        size="small" 
        appearance={isGoalSet ? "filled" : "outline"}
        status={isGoalSet ? "success" : "basic"}
      >
        <StyledText category='p1' className="text-center">Set a goal</StyledText>
      </StyledButton>
    </TouchableOpacity>
  );
};

export default SetGoalButton;