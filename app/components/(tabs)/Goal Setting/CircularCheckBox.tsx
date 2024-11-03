import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@ui-kitten/components';

interface CircularCheckboxProps {
  status?: "checked" | "unchecked";
  isChecked?: boolean; 
  onPress: () => void; 
  iconColor?: string; 
}

const CircularCheckbox: React.FC<CircularCheckboxProps> = ({ status, isChecked, onPress, iconColor }) => {
  const theme = useTheme();
  const checked = status === "checked" || isChecked;

  return (
    <TouchableOpacity onPress={onPress} className="items-center justify-center p-2">
      <View
        className="h-5 w-5 rounded-full border-2 flex items-center justify-center"
        style={{
          backgroundColor: checked ? theme['color-primary-default'] : 'transparent',
          borderColor: checked ? theme['color-primary-default'] : theme['color-basic-300'],
        }}
      >
        {checked && <Ionicons name="checkmark" color={iconColor || "white"} />}
      </View>
    </TouchableOpacity>
  );
};

export default CircularCheckbox;
