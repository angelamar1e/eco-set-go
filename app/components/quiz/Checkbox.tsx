import React, { FC } from 'react';
import { Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, useTheme } from '@ui-kitten/components';

interface CheckboxProps {
  title: string;
  isChecked: boolean;
  onPress: () => void;
}

const CheckboxChoices: FC<CheckboxProps> = ({ title, isChecked, onPress }) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        marginVertical: 4,
        marginHorizontal: 4,
        padding: 16,
        width: '100%',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: isChecked ? theme['color-primary-500'] : theme['color-basic-400'],
      }}
    >
      <View>
        <MaterialIcons
          name={isChecked ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={isChecked ? theme['color-primary-500'] : theme['color-basic-600']}
        />
      </View>
      <Text
        style={{
          fontSize: 16,
          marginLeft: 12,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default CheckboxChoices;