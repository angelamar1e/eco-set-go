import { Image, StyleSheet, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { router, Link } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CTAButton } from '@/components/CTAButton';
import { goToInterface } from './utils';

export default function Index() {

  useEffect(() => {
    goToInterface();
  }, [router]);

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
    <View></View>
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
