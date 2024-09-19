import { Image, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-paper";

import React, { useState } from "react";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { CTAButton } from "@/components/CTAButton";
import { goToInterface } from "./utils";

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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.stepContainer}>
        <TextInput className='text-white' placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CTAButton title="Log In" onPress={handleSignIn} variant="primary" />
        <CTAButton
          title="Sign Up"
          onPress={() => router.push("/sign_up")}
          variant="secondary"
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
