import { ThemedView } from '@/components/ThemedView';
import { AuthInputFields } from '@/components/InputFields';
import { SignUpButton } from "@/components/SignUpButton";
import React, { useState } from "react";
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
import { useUserContext } from '@/contexts/UserContext';
import { Button, Input, Layout, Modal, Text } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

interface CustomAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, message, onClose }) => (
  <Modal
    visible={visible}
    animationType="fade"
  >
    <StyledLayout style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
      <StyledLayout level="3" style={{ width: 280, padding: 20, borderRadius: 10, alignItems: "center" }}>
        <Ionicons name="alert-circle-outline" size={30} color='red' style={{ width: 32, height: 32, marginBottom: 10 }} />
        <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 16 }}>{message}</Text>
        <Button appearance="ghost" onPress={onClose}>OK</Button>
      </StyledLayout>
    </StyledLayout>
  </Modal>
);

export default function SignUp() {
  const {userUid, loading} = useUserContext();
  const [username, setUsername] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const current_date = Date().toString();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setEmailError("Invalid email address");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateUsername = (username: string) => {
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long");
      return false;
    }
    setUsernameError(null);
    return true;
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
        overall_footprint: 0
      });

      firestore().collection('initial_footprint').doc(userUid).set({
        food_footprint: 0,
        transportation_footprint: 0,
        electricity_footprint: 0,
        overall_footprint: 0
      });

      firestore().collection('daily_logs').doc(userUid).set({
      })

      firestore().collection('user_logs').doc(userUid).set({
      })

      firestore().collection('goals').doc(userUid).set({
      });

    }
    catch(error){
      console.error(error);
    }
  }

  const handleSignUp = async () => {
    if (email && password){
      try {
          const response = await auth().createUserWithEmailAndPassword(email, password);
          await createProfile(response);
          clearAllInput();
      } catch (error){
          handleError(error);
      }
      finally{
      }
    }
  };

  if (!loading){
    goToInterface("user");
  }

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

    setAlertMessage(message);
    setAlertVisible(true);
  };

  const clearAllInput = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <StyledLayout style={{ flex: 1, justifyContent: "center", paddingHorizontal: 35 }}>
      <Container>
        <TitleComponent />

        <StyledLayout className="mt-2">
          <Input
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            onBlur={() => validateUsername(username || '')}
            status={usernameError ? "danger" : "basic"}
            caption={usernameError || ""}
            accessoryLeft={<Ionicons name="person" size={25} color="#8F9BB3" />}
            style={{ marginVertical: 8, borderRadius: 7 }}
          />

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => email && validateEmail(email)}
            status={emailError ? "danger" : "basic"}
            caption={emailError || ""}
            accessoryLeft={<Ionicons name="mail" size={25} color="#8F9BB3" />}
            style={{ marginVertical: 8, borderRadius: 7 }}
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => password && validatePassword(password)}
            secureTextEntry
            status={passwordError ? "danger" : "basic"}
            caption={passwordError || ""}
            accessoryLeft={<Ionicons name="lock-closed" size={25} color="#8F9BB3" />}
            style={{ marginVertical: 8, borderRadius: 7 }}
          />
        </StyledLayout>

        <Button style={{ marginVertical: 12, borderRadius: 12, }} onPress={handleSignUp}>
          Sign Up
        </Button>
        <StyledLayout className="flex-row items-center justify-center">
          <ThemedText>Already have an account?</ThemedText>
          <Button appearance="ghost" 
             style={{ marginLeft: -16 }}
             onPress={() => router.push("/login")}
          >Login</Button>    
          </StyledLayout>
      </Container>

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </StyledLayout>
  );
}