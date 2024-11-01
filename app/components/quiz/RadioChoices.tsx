import React, { FC } from 'react';
import { Pressable } from 'react-native';
import { Text } from '@ui-kitten/components';
import { myTheme } from '@/constants/custom-theme';

interface ChoicesProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export const RadioChoices: FC<ChoicesProps> = ({ title, isSelected, onPress }) => {
  const cardStyle = {
    marginVertical: 4,
    marginHorizontal: 4, 
    padding: 16, 
    width: '100%' as const, 
    borderColor: isSelected ? myTheme['color-primary-500'] : myTheme['color-basic-400'],
    borderWidth: isSelected ? 2 : 1,
    borderRadius: 8,
  };

  const textStyle = {
    fontSize: 16,
  };

  return (
    <Pressable onPress={onPress} style={cardStyle}> 
      <Text style={textStyle}>{title}</Text> 
    </Pressable>
  );
};
