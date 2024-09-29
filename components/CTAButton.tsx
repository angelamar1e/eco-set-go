import React, { FC } from "react";

import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

type ButtonType = "primary" | "secondary";

interface CTAButtonProps {
  title: string;
  variant: ButtonType;
  onPress: () => void;
}

export const CTAButton: FC<CTAButtonProps> = ({ title, onPress, variant }) => {
  const containerStyle =
    variant === "primary" ? styles.containerPrimary : styles.containerSecondary;

  const textStyle =
    variant === "primary" ? styles.textPrimary : styles.textSecondary;

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerPrimary: {
    height: 50,
    backgroundColor: "#407F3D",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  containerSecondary: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textPrimary: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  textSecondary: {
    fontSize: 15,
    fontWeight: "regular",
    color: "gray",
  },
});