import React from 'react';
import { Button } from 'react-native-paper';
import { styled } from "nativewind";
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native';

const StyledButton = styled(Button);

const SetGoalButton = () => {
  return (
    <TouchableOpacity className='absolute bottom-6 right-10 rounded-full bg-green-500 w-[25%] p-1'>
        <ThemedText className='text-white text-center text-[14px]'>Set a goal</ThemedText>
    </TouchableOpacity>
  );
};

export default SetGoalButton;