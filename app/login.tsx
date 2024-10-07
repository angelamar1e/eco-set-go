import { Image, StyleSheet, Alert, View, Text } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";
import { Container } from "@/components/Container";
import { TitleComponent } from "@/components/Title";
import { ThemedView } from "@/components/ThemedView";
import { LoginButton } from "@/components/LoginButton";
import { SignUpButton } from "@/components/SignUpButton";
import { TextInput } from "react-native-paper";
import { Feather, FontAwesome } from '@expo/vector-icons';
import { goToInterface } from "./utils/utils";

export default function LogInScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignIn = async () => {
    if (email && password) {
      try {
        await auth().signInWithEmailAndPassword(email, password);
        // Navigate to the interface after successful login
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

        {/* Email Input Field */}
        <View className='py-1.5'>
          <View>
            <FontAwesome
              name="envelope-o"
              size={24}
              style={{ position: 'absolute', left: 16, top: 12, color: '#757575', zIndex: 10 }} 
            />
            <TextInput
              className="pl-14 pr-4 py-3 bg-[#F6F5F3] rounded-lg text-[#757575] w-full h-12"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Password Input Field */}
        <View className='py-1.5'>
          <View>
            <Feather
              name="lock"
              size={24}
              style={{ position: 'absolute', left: 16, top: 12, color: '#757575', zIndex: 10 }} 
            />
            <TextInput
              className="pl-14 pr-4 py-3 bg-[#F6F5F3] rounded-lg text-[#757575] w-full h-12"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Login Button */}
        <LoginButton 
          title="Log In"
          onPress={handleSignIn} 
          variant="primary"  
        />
      </Container>

      {/* Sign Up Button */}
      <SignUpButton
        title="Don't have an account? Sign Up"
        onPress={() => router.push("/sign_up")}
        variant="secondary"
      />
    </ThemedView>
  );
}
