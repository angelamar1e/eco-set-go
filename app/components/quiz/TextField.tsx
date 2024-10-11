import { View } from 'react-native';
import React, { FC } from 'react';
import {TextInput} from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';

interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  unit: string;
}

export const TextField: FC<TextFieldProps> = ({unit, value, onChangeText, onBlur}) => {

  return (
      <View className="flex-row items-center">
        <TextInput
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        outlineColor='gray'
        activeOutlineColor='#22C55E'
        className='bg-white w-[70%]'
        theme={{
          roundness: 10,
        }}
        onBlur={onBlur}
      />
      <ThemedText className="ml-4">{unit}</ThemedText>
      </View>
      
  );
};
