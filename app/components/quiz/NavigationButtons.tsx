import React, { FC } from "react";
import { TouchableOpacity, Text, useColorScheme } from "react-native";

interface NavigationButtonProps {
  title: string;
  variant: "primary" | "secondary";
  onPress?: () => void;
}

export const NavigationButtons: FC<NavigationButtonProps> = ({ title, variant, onPress }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const containerStyle =
    variant === "primary" 
      ? "bg-green-600 rounded-full w-[45%] p-2 ml-2 mr-2"
      : "bg-green-900 rounded-full w-[45%] p-2 ml-2 mr-2";

  const textStyle =
    variant === "primary"
      ? "text-white text-center"
      : isDarkMode
      ? "text-white text-center"
      : "text-black text-center";

  return (
    <TouchableOpacity className={containerStyle} onPress={onPress}>
      <Text className={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
