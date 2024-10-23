import React from 'react';
import { Button, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';

const StyledButton = styled(Button);
const StyledText = styled(Text);

const GoToMilestones = () => {
  const router = useRouter();

  return (
    <StyledButton
      onPress={() => router.push('/components/(tabs)/Rewards/MilestonesPage')}
      status="basic" 
      size="small"
      className="rounded-full justify-between"
    >
      <StyledText category="label">
        View Milestones
      </StyledText>
    </StyledButton>
  );
};

export default GoToMilestones;
