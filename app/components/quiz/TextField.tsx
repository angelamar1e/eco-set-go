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
  const handleChangeText = (text: string) => {
    const numericValue = parseFloat(text);
    if (!isNaN(numericValue)) {
      onChangeText(numericValue.toString());
    } else {
      onChangeText('');
    }
  };

  return (
    <View className="flex-row items-center">
      <Input
        value={value}
        onChangeText={handleChangeText}
        onBlur={onBlur}
        onPressOut={onBlur}
        keyboardType='numeric'
        style={{ borderRadius: 10, width: '40%', marginRight: 10 }} 
        textStyle={{ minHeight: 40, fontFamily: 'Poppins-Regular', fontSize: 14 }}
      />
      <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13}}>{unit}</Text>
    </View>
  );
};