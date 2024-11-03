import { View } from 'react-native';
import React, { FC } from 'react';
import { Input, Text } from '@ui-kitten/components';

interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  unit: string;
  width?: string | number;
}

export const TextField: FC<TextFieldProps> = ({ unit, value, onChangeText, onBlur,}) => {
  return (
    <View className="flex-row items-center">
      <Input
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        style={{ borderRadius: 10, width: '60%', marginRight: 10 }} 
        textStyle={{ minHeight: 40 }}
      />
      <Text style={{ fontFamily: 'Poppins-Regular'}}>{unit}</Text>
    </View>
  );
};
