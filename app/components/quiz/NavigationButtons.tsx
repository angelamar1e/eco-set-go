import React, { FC } from "react";
import { Button, Text } from "@ui-kitten/components";
import { useThemeColor } from "@/hooks/useThemeColor";
import { myTheme } from "@/constants/custom-theme";

interface NavigationButtonProps {
  title: string;
  onPress?: () => void;
}

export const NavigationButtons: FC<NavigationButtonProps> = ({ title, onPress }) => {

  return (
    <Button
      style={{
        borderColor: myTheme['color-success-700'],        
        borderRadius: 15,
        width: '45%',
        marginHorizontal: 8,
      }}
      onPress={onPress}
      appearance= "ghost" 
    >
      <Text style={{ color: 'white', textAlign: 'center' }}>{title}</Text>
    </Button>
  );
};