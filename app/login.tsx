import React, { useState } from "react";
import { View, Modal, Touchable, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";
import { Layout, Text, Input, Button } from "@ui-kitten/components";
import { Container } from "@/components/Container";
import { TitleComponent } from "@/components/Title";
import { goToInterface } from "./utils/utils";
import {  Ionicons } from "@expo/vector-icons";
import { styled } from "nativewind";

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
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <StyledLayout style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
      <StyledLayout level="3"  style={{ width: 280, padding: 20, borderRadius: 10, alignItems: "center",}}>
        <Ionicons name="alert-circle-outline" size={30} color='red' style={{ width: 32, height: 32, marginBottom: 10 }} />
        <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 16 }}>{message}</Text>
        <Button appearance="ghost" onPress={onClose}>OK</Button>
      </StyledLayout>
    </StyledLayout>
  </Modal>
);

export default function LogInScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

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

  const handleSignIn = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      try {
        await auth().signInWithEmailAndPassword(email, password);
        goToInterface();
        clearAllInput();
      } catch (e) {
        setAlertMessage("Login Error");
        setAlertVisible(true);
        console.error(e);
      }
    } else {
      setAlertMessage("Please fix the errors before submitting");
      setAlertVisible(true);
    }
  };

  const clearAllInput = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <StyledLayout style={{ flex: 1, justifyContent: "center", paddingHorizontal: 35 }}>
      <Container>
        <TitleComponent />

      <StyledLayout className="mt-2">
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onBlur={() => validateEmail(email)}
          status={emailError ? "danger" : "basic"}
          caption={emailError || ""}
          accessoryLeft={<Ionicons name="mail" size={25} color="#8F9BB3" />}
          style={{ marginVertical: 8, borderRadius: 7,}}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => validatePassword(password)}
          secureTextEntry
          status={passwordError ? "danger" : "basic"}
          caption={passwordError || ""}
          accessoryLeft={<Ionicons name="lock-closed" size={25} color="#8F9BB3"/>}
          style={{ marginVertical: 8, borderRadius: 7,}}
        />

        <Button style={{ marginVertical: 12, borderRadius: 12, }} onPress={handleSignIn}>
          Log In
        </Button>

        <StyledLayout className="flex-row items-center justify-center">
          <StyledText>Don't have an account?</StyledText>
          <Button appearance="ghost" 
             style={{ marginLeft: -16 }}
            onPress={() => router.push("/sign_up")}
          >
            Sign Up
          </Button>
        </StyledLayout>
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
