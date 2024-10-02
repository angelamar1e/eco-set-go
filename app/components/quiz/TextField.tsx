import React, { FC } from 'react';
import {TextInput} from 'react-native-paper';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const TextField: FC<TextFieldProps> = ({label, value, onChangeText}) => {

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      outlineColor='green'
      activeOutlineColor='green'
    />
  );
};
