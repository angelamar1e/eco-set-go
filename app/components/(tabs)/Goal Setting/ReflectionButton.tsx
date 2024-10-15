import React from 'react';
import { Button } from 'react-native-paper';
import { styled } from "nativewind";
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native';

const StyledButton = styled(Button);

const ReflectionButton = () => {
  return (
    <TouchableOpacity className='rounded-full bg-lime-800 w-[86%] p-1 mb-3'>
        <ThemedText className='text-white text-center text-[14px]'>Write a reflection entry</ThemedText>
    </TouchableOpacity>
  );
};

export default ReflectionButton;