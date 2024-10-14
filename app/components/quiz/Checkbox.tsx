import React, { FC } from 'react';
import { Text, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For checkbox icon

interface CheckboxProps {
  title: string;
  isChecked: boolean;
  onPress: () => void;
}

const CheckboxChoices: FC<CheckboxProps> = ({ title, isChecked, onPress }) => {
  const containerStyle = isChecked
    ? 'mt-1 mb-1 ml-1 mr-1 p-4 w-[100%] bg-white rounded-lg border border-green-500 flex-row items-center'
    : 'mt-1 mb-1 ml-1 mr-1 p-4 w-[100%] bg-white rounded-lg border border-gray-300 flex-row items-center';

  const textStyle = isChecked
    ? 'text-green-500 text-base ml-3'
    : 'text-black text-base ml-3';

  return (
    <Pressable className={containerStyle} onPress={onPress}>
      <View>
        {/* Checkbox icon - check box if selected, check box outline if not */}
        <MaterialIcons
          name={isChecked ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={isChecked ? "#22C55E" : "gray"}
        />
      </View>
      <Text className={textStyle}>{title}</Text>
    </Pressable>
  );
};

export default CheckboxChoices;