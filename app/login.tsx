import { Image, StyleSheet, Alert, View, Text } from "react-native";
import React, { useState } from "react";
import { router, Link } from "expo-router";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { CTAButton } from "@/components/CTAButton";
import { goToInterface } from "./utils";
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
      } catch (e) {
        Alert.alert("Login Error");
      }
    }
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
