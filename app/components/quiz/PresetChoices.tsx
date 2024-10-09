import React, { FC } from 'react';
import { Text, Pressable } from 'react-native';

interface PresetChoicesProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export const PresetChoices: FC<PresetChoicesProps> = ({ title, isSelected, onPress }) => {
  const containerStyle = isSelected
    ? 'mt-1 mb-1 ml-1 mr-1 p-2 pl-4 pr-4 h-10 bg-[#9CD87E] rounded-full border-2 border-lime-800 justify-center flex-initial'
    : 'mt-1 mb-1 ml-1 mr-1 p-2 pl-4 pr-4 h-10 bg-[#9CD87E] rounded-full justify-center flex-initial';

    const textStyle = 'text-lime-800 text-center';

  return (
    <Pressable className={containerStyle} onPress={onPress}>
      <Text className={textStyle}>{title}</Text>
    </Pressable>
  );
};
