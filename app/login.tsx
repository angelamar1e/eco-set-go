import { Image, StyleSheet, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { router, Link } from "expo-router";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CTAButton } from "@/components/CTAButton";

export default function LogInScreen() {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  const handleSignIn = async () => {
    if (email && password) {
      try {
        await auth().signInWithEmailAndPassword(email, password);
        goToProperInterface();
      } catch (e) {
        Alert.alert("Login Error");
      }
    }
  };

  const goToProperInterface = async () => {
    const currentUser = auth().currentUser!;
    const refPath = `users/${currentUser.uid}/role`;

    db()
      .ref(refPath)
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          const role = snapshot.val();
          console.log(role);
          if (role == "user") {
            router.push('/(tabs)');
          } else {
            router.push("/(admin)");
          }
        }
      });
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
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
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
