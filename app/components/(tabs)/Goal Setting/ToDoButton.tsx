import React, { FC } from "react";
import { TouchableOpacity, Text, ViewStyle } from "react-native";

interface ToDoButtonProps {
  title: string;
  isActive: boolean;
  onPress?: () => void;
}

export const ToDoButton: FC<ToDoButtonProps> = ({ title, isActive, onPress }) => {
  const buttonStyle: ViewStyle = {
    width: 60,
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: 50,
    backgroundColor: isActive ? '#34C759' : '#F3F4F6',
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const textStyle = {
    textAlign: 'center' as 'center',
    fontSize: 14,
    color: isActive ? 'white' : 'black',
  };

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
