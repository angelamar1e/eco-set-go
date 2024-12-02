import { ThemedView } from '@/components/ThemedView';
import { AuthInputFields } from '@/components/InputFields';
import { SignUpButton } from "@/components/SignUpButton";
import React, { useState, useEffect, useContext } from "react";
import {
  Alert,
  View
} from "react-native";
import { Link, router, Stack, useRouter } from 'expo-router';
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { goToInterface } from './utils/utils';
import { CTAButton } from '@/components/CTAButton';
import { Container } from '@/components/Container';
import { TitleComponent } from '@/components/Title';
import { ThemedText } from '@/components/ThemedText';
import { useUserContext } from '@/contexts/UserContext';
import { Button, Input, Layout, Modal, Text } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { myTheme } from '@/constants/custom-theme';
import TakeaQuiz from './(quiz)/takeaquiz';
import { EmissionsContext } from '@/contexts/Emissions';
import { EmissionsData } from '../constants/DefaultValues';
import { useLoadFonts } from '@/assets/fonts/loadFonts';

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
  const fontsLoaded = useLoadFonts();
  const {initializeData} = useContext(EmissionsContext);
  const {userUid, fetchUserDetails, setProfileCreated} = useUserContext();
  const [username, setUsername] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Tracks if the login process is in progress

  const router = useRouter();

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
      await Promise.all([
        firestore().collection('users').doc(userUid).set({
          role: "user",
          username,
          created_at: current_date,
          points: 0,
          redeemablePoints: 0,
        }, {merge: true}),
        firestore().collection('current_footprint').doc(userUid).set({
          food_footprint: 0,
          transportation_footprint: 0,
          electricity_footprint: 0,
          overall_footprint: 0
        }, {merge: true}),
        firestore().collection('initial_footprint').doc(userUid).set({
          food_footprint: 0,
          transportation_footprint: 0,
          electricity_footprint: 0,
          overall_footprint: 0
        }, {merge: true}),
        firestore().collection('daily_logs').doc(userUid).set({}, {merge: true}),
        firestore().collection('user_logs').doc(userUid).set({}, {merge: true}),
        firestore().collection('goals').doc(userUid).set({}, {merge: true})
      ]);
    } catch (error) {
      console.error(error);
    }
  }
  
  const handleSignUp = async () => {
    if (email && password) {
      setIsLoggingIn(true);
      try {
        const response = await auth().createUserWithEmailAndPassword(email, password);
        setProfileCreated(false);
        await createProfile(response);
        setProfileCreated(true);
        clearAllInput();
      } catch (error) {
        handleError(error);
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
        message = error.message;
    }

    setAlertMessage(message);
    setAlertVisible(true);
  };

  const clearAllInput = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  if (!fontsLoaded) {
    return null;
  }



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
            textStyle={{ fontFamily: 'Poppins-Regular', paddingTop: 5, fontSize: 14 }}
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
            textStyle={{ fontFamily: 'Poppins-Regular', paddingTop: 5, fontSize: 14 }}
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
            textStyle={{ fontFamily: 'Poppins-Regular', paddingTop: 5, fontSize: 14 }}
          />
        </StyledLayout>

        <TouchableOpacity
          style={{ 
            marginVertical: 12,
            borderRadius: 12,
            backgroundColor: myTheme['color-success-700'],
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={handleSignUp}
        >
          <StyledText style={{
            fontFamily: 'Poppins-Medium',
            color: 'white',
            fontSize: 14,
            top: 2
          }}>
              {isLoggingIn ? "Signing Up" : "Sign Up"}
          </StyledText>
        </TouchableOpacity>
        <StyledLayout style={{flexDirection: 'row', marginTop: 12, alignItems: 'center', justifyContent: 'center'}}>
          <StyledText style={{color: '#8F9BB3', fontSize: 13, fontFamily: 'Poppins-Regular'}}>Already have an account?</StyledText>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <StyledText style={{fontSize: 13, fontFamily: 'Poppins-SemiBold', color: myTheme['color-success-700']}}> Login</StyledText>
          </TouchableOpacity>
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