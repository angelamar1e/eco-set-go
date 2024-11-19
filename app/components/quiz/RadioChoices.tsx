import React, { FC, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { myTheme } from '@/constants/custom-theme';
import { FontAwesome6 } from '@expo/vector-icons';

interface ChoicesProps {
  title: string;
  example?: string;
  choices_tip?: string;
  isSelected: boolean;
  onPress: () => void;
}

export const RadioChoices: FC<ChoicesProps> = ({ title, example, choices_tip, isSelected, onPress }) => {
  const [isTipVisible, setTipVisible] = useState(false); // State to toggle tip visibility

  const cardStyle = {
    marginVertical: 4,
    marginHorizontal: 4,
    padding: 16,
    width: '100%' as const,
    borderColor: isSelected ? myTheme['color-primary-500'] : myTheme['color-basic-400'],
    borderWidth: isSelected ? 2 : 1,
    borderRadius: 8,
  };

  const titleTextStyle = {
    fontSize: 16,
  };

  const exampleTextStyle = {
    fontSize: 13,
    color: myTheme['color-basic-600'],
  };

  const tipTextStyle = {
    fontSize: 14,
    color: myTheme['color-basic-700'],
  };

  const tipCardStyle = {
    marginTop: 8,
    padding: 12,
    backgroundColor: myTheme['color-basic-200'],
    borderRadius: 8,
  };

  const titleRowStyle = {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  };

  return (
    <Pressable onPress={onPress} style={cardStyle}>
      <View style={titleRowStyle}>
        <Text style={titleTextStyle}>{title}</Text>
        {choices_tip && (
          <Pressable onPress={() => setTipVisible(!isTipVisible)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome6 name="question-circle" size={16} color={myTheme['color-success-700']} />
          </Pressable>
        )}
      </View>

      {example && <Text style={exampleTextStyle}>{example}</Text>}

      {isTipVisible && choices_tip && (
        <View style={tipCardStyle}>
          <Text style={tipTextStyle}>{choices_tip}</Text>
        </View>
      )}
    </Pressable>
  );
};
