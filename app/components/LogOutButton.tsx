import React from 'react';
import { handleLogOut } from '../utils/utils';
import { Button } from 'react-native-paper';
import { styled } from "nativewind";
import { ThemedText } from '@/components/ThemedText';

const StyledButton = styled(Button);

const LogOutButton = () => {
  return (
    <Button onPress={handleLogOut} mode='contained' className='absolute bottom-5 right-6 rounded-[25px] bg-lime-800'>
      <ThemedText type='default' className='text-stone-300'>
        Log Out
      </ThemedText>
    </Button>
  );
};

export default LogOutButton