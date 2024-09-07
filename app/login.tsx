import { Image, StyleSheet, Platform, TextInput, Alert,  Button } from 'react-native';
import React, { useState } from 'react';
import { router, Link} from 'expo-router';
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CTAButton } from '@/components/CTAButton';

export default function LogInScreen() {

    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    const handleSignIn = async () => {
        if (email && password){
            try {
                await auth().signInWithEmailAndPassword(email, password);
            } catch (e){
                Alert.alert('Login Error');
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
    <ThemedView style={styles.stepContainer}>
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
            title="Log In"
            onPress={handleSignIn}
            variant="primary"
          />
        <Link href={'/sign_up'}>
          <Button title='Sign Up'/>
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
