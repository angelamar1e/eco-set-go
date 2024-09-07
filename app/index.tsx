import { Image, StyleSheet, Platform, TextInput, Alert, Pressable, Button } from 'react-native';
import React, { useState } from 'react';
import { router, Link } from 'expo-router';
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CTAButton } from '@/components/CTAButton';

export default function Index() {

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
        <Link href={'/login'}>
          <Button title='Log In'/>
        </Link>
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
