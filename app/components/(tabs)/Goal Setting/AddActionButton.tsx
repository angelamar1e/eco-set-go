import React from 'react';
import { Button } from 'react-native-paper';
import { styled } from "nativewind";
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native';

const StyledButton = styled(Button);

const AddActionButton = () => {
  return (
    <TouchableOpacity className='ml-14 rounded-full bg-lime-800 w-[27%] p-1 z-10'>
        <ThemedText className='text-white text-center text-[14px]'>Add an action</ThemedText>
    </TouchableOpacity>


  );
};

export default AddActionButton;