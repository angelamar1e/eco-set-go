import { Image, StyleSheet, Alert, View } from "react-native";
import { TextInput } from "react-native-paper";
import React, { useState } from "react";
import { router, Link } from "expo-router";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CTAButton } from "@/components/CTAButton";
import { Feather, FontAwesome } from '@expo/vector-icons';

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
            router.push("(tabs)");
          } else {
            router.push("(admin)");
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
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Eco Set Go</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <View style={styles.inputWrapper}>
          <FontAwesome name="envelope-o" style={styles.icon} />
          <TextInput 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail}
            mode='flat'
            underlineColor='#ccc' 
            activeUnderlineColor= '#407F3D'
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Feather name="lock" style={styles.icon}/>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode='flat'
            underlineColor='#ccc' 
            activeUnderlineColor= '#407F3D'
            style={styles.input}
          />
        </View>
        
        <CTAButton 
          title="Log In" 
          onPress={handleSignIn} 
          variant="primary"  
        />

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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 12,
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  inputWrapper:{
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', 
    borderRadius: 10,            
    overflow: 'hidden',
    height:50,
  },
  input:{
    backgroundColor: '#F6F5F3',
    paddingLeft: 40,
    flex:1,
    borderRadius: 10,
    overflow: 'hidden',
    fontSize: 14,
    color: '#757575'
  },
  icon: {
    position: 'absolute',
    paddingLeft: 20,
    zIndex: 10,
    color: '#757575',
    fontSize: 24,
  },
});
