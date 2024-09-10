import { Image, StyleSheet, Platform, TextInput, Alert, Pressable, Button, Text } from 'react-native';
import React, {useState, useEffect} from 'react';
import { router, Link } from 'expo-router';
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CTAButton } from '@/components/CTAButton';
import { log } from '@react-native-firebase/crashlytics';
import LogInScreen from './login';

export default function Index() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = auth().currentUser;`         `

        if (user){
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkSession();
  }, [router]);


  if (isLoggedIn){
    router.push('/(tabs)');
    return null;
  }

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
      <CTAButton
        title="Log In"
        onPress={() => router.push('/login')}
        variant="primary"
      />
      <CTAButton
        title="Sign Up"
        onPress={() => router.push('/sign_up')}
        variant="primary"
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
