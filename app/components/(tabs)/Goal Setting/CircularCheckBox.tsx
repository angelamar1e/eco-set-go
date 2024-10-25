import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@ui-kitten/components';

interface CircularCheckboxProps {
  isChecked: boolean;
  onPress: () => void;
}

const CircularCheckbox: React.FC<CircularCheckboxProps> = ({ isChecked, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} className="items-center justify-center p-2">
      <View
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center`}
        style={{
          backgroundColor: isChecked ? theme['color-primary-default'] : 'transparent', 
          borderColor: isChecked ? theme['color-primary-default'] : theme['color-basic-300'], 
        }}
      >
        {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
    </TouchableOpacity>
  );
};

export default CircularCheckbox;
