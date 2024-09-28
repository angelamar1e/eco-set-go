import { Image, StyleSheet, Alert, View, Text } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { goToInterface } from "./utils/utils";
import { LoginButton } from "@/components/LoginButton";
import { SignUpButton } from "@/components/SignUpButton";
import { AuthInputFields } from "@/components/InputFields";
import {Container} from "@/components/Container";
import { TitleComponent } from "@/components/Title";

import { NativeWindStyleSheet } from "nativewind";
  NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function LogInScreen() {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  const handleSignIn = async () => {
    if (email && password) {
      try {
        await auth().signInWithEmailAndPassword(email, password);
        goToInterface();
        clearAllInput();
      } catch (e) {
        Alert.alert("Login Error");
        console.error(e);
      }
    }
  };

  const clearAllInput = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <ThemedView className="flex-1 justify-center w-full px-8">
        <Container>
          <TitleComponent />

          <AuthInputFields formType="login"/>

        <LoginButton 
          title="Log In" 
          onPress={handleSignIn} 
          variant="primary"  
        />
        </Container>

        <SignUpButton
          title="Don't have an account? Sign Up"
          onPress={() => router.push("/sign_up")}
          variant="secondary"
        />

      </ThemedView>
  );
}
