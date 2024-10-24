import React from 'react';
import { Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { myTheme } from '@/constants/custom-theme';

const StyledText = styled(Text);

const GoToMilestones = () => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push('/components/(tabs)/Rewards/MilestonesPage')}>
      <StyledText category="h6" className=" items-center ml-3"
        style={{color: myTheme['color-primary-900']}}
      >
        View Milestones
      </StyledText>
    </TouchableOpacity>
  );
};

export default GoToMilestones;
