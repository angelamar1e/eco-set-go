import React, { FC } from "react";
import { TouchableOpacity, Text, useColorScheme } from "react-native";

interface NavigationButtonProps {
  title: string;
  variant: "primary" | "secondary";
  onPress?: () => void;
}

export const NavigationButtons: FC<NavigationButtonProps> = ({ title, variant }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const containerStyle =
    variant === "primary" 
      ? "bg-green-600 rounded-full w-[45%] p-2 ml-2 mr-2"
      : "bg-gray-200 rounded-full w-[45%] p-2 ml-2 mr-2";

  const textStyle =
    variant === "primary"
      ? "text-white text-center"
      : isDarkMode
      ? "text-white text-center"
      : "text-black text-center";

  return (
    <TouchableOpacity className={containerStyle}>
      <Text className={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
