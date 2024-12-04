import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@ui-kitten/components';
import { Checkbox } from 'react-native-paper';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

interface CircularCheckboxProps {
  type?: "dropdown" | "basic"
  status?: "checked" | "unchecked";
  isChecked?: boolean; 
  onPress?: () => void; 
  iconColor?: string; 
}

const CircularCheckbox: React.FC<CircularCheckboxProps> = ({ type = "basic", status, isChecked, iconColor, onPress }) => {
  const theme = useTheme();
  const checked = status === "checked" || isChecked;

  return (
    <TouchableOpacity onPress={onPress} className="items-center justify-center p-2 z-0">
      <View
        className="h-5 w-5 rounded-full border-2 flex items-center justify-center"
        style={{
          backgroundColor: checked ? theme['color-success-600'] : type === 'dropdown' ? theme['color-basic-300'] : "transparent",
          borderColor: checked ? theme['color-success-600'] : type === 'dropdown' ? theme['color-basic-300'] : theme['color-success-600'],
        }}
      >
        {!checked && type === 'dropdown' && <Ionicons name="caret-down-outline" color={iconColor || theme['color-basic-600']} />}
        {checked && <Ionicons name="checkmark" color={iconColor || "white"} />}
      </View>
    </TouchableOpacity>
  );
};

export default CircularCheckbox;
