import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';

const GoToMilestones = () => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push('/components/(tabs)/Rewards/MilestonesPage')} activeOpacity={0.7}>
      <ThemedText type='defaultSemiBold' className="text-green-600 text-[17px] pl-4">View Milestones</ThemedText>
    </TouchableOpacity>
  );
};

export default GoToMilestones;
