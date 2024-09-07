import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CTAButton } from '@/components/CTAButton';
import React, { useState } from "react";
import {
  Image, 
  StyleSheet, 
  TextInput,
  Pressable,
  Keyboard,
  Button,
  Alert,
} from "react-native";
import { Link, router, Stack } from 'expo-router';
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";

export default function SignUp() {
  const [username, setUsername] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const current_date = Date().toString();
  const food_footprint = 0;
  const mobility_footprint = 0;
  const electricity_footprint = 0;
  const overall_footprint = 0;

  const clearAllInput = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const createProfile = async (response: FirebaseAuthTypes.UserCredential) => {
    db().ref(`/users/${response.user.uid}`).set({username});
    db().ref(`/users/${response.user.uid}`).set({created_at: current_date});
    db().ref(`/users/${response.user.uid}`).set({role: 'user'});
    db().ref(`/current_footprint/${response.user.uid}`).set({
      food_footprint,
      mobility_footprint,
      electricity_footprint,
      overall_footprint,
      created_at: current_date
    });
  };

  const handleSignUp = async () => {
    if (email && password){
      try {
        const response = await auth().createUserWithEmailAndPassword(email, password);

        if (response.user){
            createProfile(response);
        }

      } catch (e){
        Alert.alert("Oops", "Please check your form and try again.");
      }
    }
  };
 
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
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TextInput 
          placeholder='Name'
          value={username}
          onChangeText={setUsername}/>
        <TextInput 
          placeholder='Email'
          value={email}
          onChangeText={setEmail}/>
          <TextInput 
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry/>
          <CTAButton
            title="Sign Up"
            onPress={handleSignUp}
            variant="primary"
          />
          <Link href={'/login'}>
            <Button title='Log In'/>
        </Link>
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
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
