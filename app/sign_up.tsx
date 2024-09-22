import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CTAButton } from '@/components/CTAButton';
import { AuthInputFields } from '@/components/InputFields';
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import {
  Alert,
  Image, 
  StyleSheet,
  View,
} from "react-native";
import { Link, router, Stack } from 'expo-router';
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { goToInterface } from './utils';

export default function SignUp() {
  const [username, setUsername] = useState<string>('');  // changed from undefined to empty strings to ensure variables are always strings
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(''); 
  const [loading, setLoading] = useState(false);

  const current_date = Date().toString();

  const clearAllInput = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const createProfile = async (response: FirebaseAuthTypes.UserCredential) => {
    const userUid = response.user.uid;

    try {
      firestore().collection('users').doc(userUid).set({
        role: "user",
        username,
        created_at: current_date,
      });

      firestore().collection('current_footprint').doc(userUid).set({
        food_footprint: 0,
        transportation_footprint: 0,
        electricity_footprint: 0,
        overall_footprint: 2.27 // initially set to the national average
      });
    }
    catch(error){
      console.error(error);
    }
  }

  const handleSignUp = async () => {
    setLoading(true);
    if (email && password){
      try {
          const response = await auth().createUserWithEmailAndPassword(email, password);
          createProfile(response);
          clearAllInput();
          goToInterface();
      } catch (error){
          handleError(error);
      }
      finally{
        setLoading(false);
      }
    }
  };

  const handleError = (error: any) => {
    let message = 'An error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'The email address is badly formatted.';
        break;
      case 'auth/email-already-in-use':
        message = 'The email address is already in use by another account.';
        break;
      case 'auth/weak-password':
        message = 'The password is too weak. Please choose a stronger password.';
        break;
      case 'auth/missing-email':
        message = 'Please provide an email address.';
        break;
      default:
        message = error.message; // Generic error message
    }

    Alert.alert('Sign Up Error', message);
  };

  const fields = [
    {
      placeholder: "Username",
      value: username,
      onChangeText: setUsername,
      icon: { library: "Feather" as 'Feather', name: "user" },
    },
    {
      placeholder: "Email",
      value: email,
      onChangeText: setEmail,
      icon: { library: "FontAwesome" as 'FontAwesome', name: "envelope-o" },
    },
    {
      placeholder: "Password",
      value: password,
      onChangeText: setPassword,
      secureTextEntry: true,
      icon: { library: "Feather" as 'Feather', name: "lock" },
    },
  ];
 
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedView>

      <ThemedView>
        <AuthInputFields fields={fields}/>

        <CTAButton
          title={loading ? "Signing Up..." : "Sign Up"}
          onPress={handleSignUp}
          variant="primary"
        />
        <CTAButton
          title="Log In"
          onPress={() => router.push('/login')}
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
