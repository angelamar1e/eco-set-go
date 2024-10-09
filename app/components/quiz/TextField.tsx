import React, { FC } from 'react';
import {TextInput} from 'react-native-paper';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
}

export const TextField: FC<TextFieldProps> = ({label, value, onChangeText, onBlur}) => {

  return (
      <TextInput
        label={label}
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
  );
};
