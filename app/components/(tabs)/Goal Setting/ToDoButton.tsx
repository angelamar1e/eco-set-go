import React, { FC } from "react";
import { TouchableOpacity, Text, useColorScheme, ViewStyle } from "react-native";

interface ToDoButtonProps {
  title: string;
  variant: "primary" | "secondary";
  onPress?: () => void;
  style?: ViewStyle;
}

export const ToDoButton: FC<ToDoButtonProps> = ({ title, variant, style }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const containerStyle =
    variant === "primary" 
      ? "bg-green-600 rounded-full w-[18%] p-1 ml-7 mr-1"
      : "bg-stone-100 rounded-full w-[18%] p-1 mr-7";

  const textStyle =
    variant === "primary"
      ? "text-white text-center text-[14px]"
      : "text-black text-center text-[14px]"

  return (
    <TouchableOpacity className={containerStyle}>
      <Text className={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
