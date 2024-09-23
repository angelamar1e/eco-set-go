import React, { FC } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type ButtonType = "primary" | "secondary";

interface SignUpButtonProps {
  title: string;
  variant: ButtonType;
  onPress: () => void;
}

export const SignUpButton: FC<SignUpButtonProps> = ({ title, onPress, variant }) => {
    const containerStyle =
      variant === "primary" 
        ? "mt-2 mb-2 h-12 bg-green-700 rounded-lg justify-center items-center" 
        : "mt-2 mb-2 h-12 bg-white rounded-lg justify-center items-center";
  
    const textStyle =
      variant === "primary"
        ? "text-white text-base" 
        : "text-black text-base";
  

  return (
    <TouchableOpacity onPress={onPress} className={containerStyle}>
      <Text className={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};