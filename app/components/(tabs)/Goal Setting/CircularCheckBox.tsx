import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CircularCheckboxProps {
  isChecked: boolean;
  onPress: () => void;
}

const CircularCheckbox: React.FC<CircularCheckboxProps> = ({ isChecked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="items-center justify-center p-2">
      {/* Circular design */}
      <View className={`w-6 h-6 rounded-full border-2 
        ${isChecked ? 'bg-green-600 border-green-600' : 'border-stone-300'} 
        flex items-center justify-center`}
      >
        {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
    </TouchableOpacity>
  );
};

export default CircularCheckbox;
