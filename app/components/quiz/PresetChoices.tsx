import React, { FC } from 'react';
import { Text, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '@ui-kitten/components';

interface PresetChoicesProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export const PresetChoices: FC<PresetChoicesProps> = ({ title, isSelected, onPress }) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = isSelected
    ? {
        marginVertical: 4,
        marginHorizontal: 4,
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 'auto',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: theme['color-success-700'], 
        backgroundColor: theme['color-success-900'], 
        justifyContent: 'center', 
        alignItems: 'center',   
      }
    : {
        marginVertical: 4,
        marginHorizontal: 4,
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 'auto',
        borderRadius: 20,
        backgroundColor: theme['color-success-700'], 
        justifyContent: 'center',
        alignItems: 'center',  
      };

  const textStyle = {
    color: theme['color-basic-100'],
    textAlign: 'center' as const,
  };

  return (
    <Pressable style={containerStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};