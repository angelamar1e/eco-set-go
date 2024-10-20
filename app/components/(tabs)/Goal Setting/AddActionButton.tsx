import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddActionButtonProps {
  isFocused: boolean;
  onPress: () => void;
}

const AddActionButton: React.FC<AddActionButtonProps> = ({ isFocused, onPress }) => {
  const iconColor = isFocused ? '#34C759' : '#A9A9A9';

  return (
    <TouchableOpacity className='w-8 h-8 p-1 left-[195px]' onPress={onPress}>
      <Ionicons name="add" size={26} color={iconColor} />
    </TouchableOpacity>
  );
};

export default AddActionButton;
