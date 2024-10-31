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
      <StyledText className="text-2sm items-center"
        style={{color: myTheme['color-success-900'], fontFamily: 'Poppins-Bold'}}
      >
        View Milestones
      </StyledText>
    </TouchableOpacity>
  );
};

export default GoToMilestones;
