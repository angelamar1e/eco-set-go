import React, { FC, useEffect, useState } from "react";
import { Button, Text } from "@ui-kitten/components";
import { Keyboard } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { myTheme } from "@/constants/custom-theme";
import { styled } from "nativewind";

const StyledText = styled(Text);

interface NavigationButtonProps {
  title: string;
  onPress?: () => void;
}

export const NavigationButtons: FC<NavigationButtonProps> = ({ title, onPress }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

  return (
    <Button
      style={{
        borderColor: myTheme['color-success-700'],        
        borderRadius: 30,
        width: '45%',
        marginHorizontal: 8,
        paddingVertical: 8,
      }}
      onPress={onPress}
      appearance="ghost"
    >
      {evaProps => (
        <StyledText 
          style={{ 
            fontFamily: 'Poppins-SemiBold',
            fontSize: 14,
            color: myTheme['color-success-700'],
            textAlign: 'center',
            top: 2
          }}
        >
          {title}
        </StyledText>
      )}
    </Button>
  );
};