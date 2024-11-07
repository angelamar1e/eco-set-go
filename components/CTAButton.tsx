import { myTheme } from "@/constants/custom-theme";
import React, { FC } from "react";
import { useColorScheme } from "react-native";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type ButtonType = "primary" | "secondary";

interface CTAButtonProps {
  title: string;
  variant: ButtonType;
  onPress: () => void;
}

export const CTAButton: FC<CTAButtonProps> = ({ title, onPress, variant }) => {
    const colorScheme = useColorScheme();

    const isDarkMode = colorScheme === "dark";
    
    const containerStyle =
      variant === "primary" 
        ? "mt-2 mb-2 h-12 w-full rounded-2xl justify-center items-center" 
        : "justify-center items-center";
  
    const textStyle =
      variant === "primary"
        ? "text-white text-base font-bold"
        : isDarkMode
        ? "text-white text-base font-bold"
        : "text-black text-base font-bold";
      

  return (
    <TouchableOpacity onPress={onPress} className={containerStyle} style={{backgroundColor: myTheme['color-success-700']}}>
      <Text className={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};