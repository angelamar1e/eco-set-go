import React, { FC } from 'react';
import { Text, Pressable } from 'react-native';

interface ChoicesProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export const RadioChoices: FC<ChoicesProps> = ({ title, isSelected, onPress }) => {
  const containerStyle = isSelected
    ? 'mt-1 mb-1 ml-1 mr-1 p-4 w-[45%] bg-white rounded-lg border border-green-500'
    : 'mt-1 mb-1 ml-1 mr-1 p-4 w-[45%] bg-white rounded-lg border border-gray-300';

  const textStyle = isSelected
    ? 'text-green-500 text-base'
    : 'text-black text-base';

  return (
    <Pressable className={containerStyle} onPress={onPress}>
      <Text className={textStyle}>{title}</Text>
    </Pressable>
  );
};
