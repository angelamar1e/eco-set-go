import React, { FC } from "react";
import { TouchableOpacity, Text, useColorScheme } from "react-native";

interface NavigationButtonProps {
  title: string;
  variant: "primary" | "secondary";
}

export const NavigationButton: FC<NavigationButtonProps> = ({ title, variant }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const containerStyle =
    variant === "primary" 
      ? "bg-green-600 rounded-full w-[48%] p-2"
      : "bg-gray-200 rounded-full w-[48%] p-2";

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
