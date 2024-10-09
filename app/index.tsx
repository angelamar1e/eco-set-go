import { View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { router, Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { goToInterface } from './utils/utils';
import { TitleComponent } from '@/components/Title';
import { LoginButton } from '@/components/LoginButton';
import { SignUpButton } from '@/components/SignUpButton';


export default function Index() {

 useEffect(() => {
   goToInterface();
   }, [router]);

  return (
    <ThemedView className="flex-1 justify-center">
      <TitleComponent />

     <View className="w-full px-8 mt-20">
        <LoginButton
          title="Log In"
          onPress={() => router.push('/login')}
          variant="primary"
        />
        <SignUpButton
          title="Sign Up"
          onPress={() => router.push('/sign_up')}
          variant="primary"
        />
      </View> 
    </ThemedView>
  );
}