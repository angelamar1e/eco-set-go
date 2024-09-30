import React, { FC } from 'react';
import { Text, Pressable } from 'react-native';

interface SuggestedAnswersProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export const SuggestedAnswers: FC<SuggestedAnswersProps> = ({ title, isSelected, onPress }) => {
  const containerStyle = isSelected
    ? 'mt-2 mb-2 mr-2 p-3 w-[48%] bg-white rounded-full border border-green-500'
    : 'mt-2 mb-2 mr-2 p-3 w-[48%] bg-white rounded-full border border-gray-300';

  const textStyle = isSelected
    ? 'text-green-500 text-center'
    : 'text-black text-center';

  return (
    <Pressable className={containerStyle} onPress={onPress}>
      <Text className={textStyle}>{title}</Text>
    </Pressable>
  );
};
