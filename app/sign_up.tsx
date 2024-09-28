import { ThemedView } from '@/components/ThemedView';
import { AuthInputFields } from '@/components/InputFields';
import { SignUpButton } from "@/components/SignUpButton";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import {
  Alert,
  View
} from "react-native";
import { Link, router, Stack } from 'expo-router';
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { goToInterface } from './utils/utils';
import { LoginButton } from '@/components/LoginButton';
import { Container } from '@/components/Container';
import { TitleComponent } from '@/components/Title';
import { ThemedText } from '@/components/ThemedText';

export default function SignUp() {
  const [username, setUsername] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
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

      firestore().collection('daily_logs').doc(userUid).set({
        action_ids: []
      })

      firestore().collection('user_logs').doc(userUid).set({
        [current_date]: []
      })
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
 
  return (
      <ThemedView className="flex-1 justify-center w-full px-8">
        <Container>
          <TitleComponent />

          <View className= "mt-20 flex-grow">
            <AuthInputFields formType='signup' />
          </View>  

          <SignUpButton
            title={loading ? "Signing Up..." : "Sign Up"}
            onPress={() => router.push('/sign_up')}
            variant="primary"
          />
        </Container>
          
        <View className="absolute bottom-10 left-0 right-0 items-center">
          <LoginButton
            title="Have an account already? Login"
            onPress={() => router.push('/login')}
            variant='secondary'
          />
        </View>        
      </ThemedView>
  );
}