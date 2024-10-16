import React from 'react';
import { Button } from 'react-native-paper';
import { styled } from "nativewind";
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native';

const StyledButton = styled(Button);

const SetGoalButton = () => {
  return (
    <TouchableOpacity className='absolute bottom-3 right-3 rounded-full bg-lime-800 w-[30%] p-1'>
        <ThemedText className='text-white text-center text-[14px]'>Set a goal</ThemedText>
    </TouchableOpacity>


  );
};

export default SetGoalButton;