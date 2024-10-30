import React, { FC } from "react";
import { TouchableOpacity } from "react-native";
import { Button, Text, useTheme, ThemeType } from "@ui-kitten/components";

interface SignUpButtonProps {
  title: string;
  onPress: () => void;
}

export const SignUpButton: FC<SignUpButtonProps> = ({ title, onPress, }) => {
  const theme = useTheme(); 

  const buttonStyle = {
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: theme['color-primary-500']
  };

  const textStyle = {
    color: theme['color-white'] 
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} accessibilityLabel={title}>
      <Button style={buttonStyle} appearance="filled">
        <Text style={textStyle}>{title}</Text>
      </Button>
    </TouchableOpacity>
  );
};