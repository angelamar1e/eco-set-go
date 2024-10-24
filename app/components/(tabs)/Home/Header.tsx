import React from "react";
import { styled } from "nativewind";
import { Button, Text, Layout } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons"; 

const StyledLayout = styled(Layout);
const StyledButton = styled(Button);
const StyledText = styled(Text);

interface HeaderProps {
  onProfilePress: () => void;
  onQuizButtonPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfilePress, onQuizButtonPress }) => (
    <StyledLayout className="flex-row justify-between items-center p-4 rounded-b-3xl">
    <StyledButton
        onPress={onQuizButtonPress}
        appearance="outline"
        status="primary"
        className="p-1 rounded-full bg-white">
            <StyledText>Calculate your footprint</StyledText>
    </StyledButton>
    <StyledButton
      onPress={onProfilePress}
      appearance="outline"
      status="primary"
      className="p-1 rounded-full bg-white"
    >
      <Ionicons name="person"/>
    </StyledButton>
  </StyledLayout>
);

export default Header;
