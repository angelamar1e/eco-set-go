import { Image, StyleSheet, Alert, View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import auth from "@react-native-firebase/auth";
import { Container } from "@/components/Container";
import { TitleComponent } from "@/components/Title";
import { ThemedView } from "@/components/ThemedView";
import { LoginButton } from "@/components/LoginButton";
import { SignUpButton } from "@/components/SignUpButton";
import { TextInput } from "react-native-paper";
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { goToInterface } from "./utils/utils";
import { useUserContext } from "@/contexts/UserContext";

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
    <View className="flex-1 justify-center items-center bg-transparent pb-10">
      <View className="flex-row w-80 py-5 px-5 pl-5 w-3/4 bg-white rounded-lg justify-between shadow-md shadow-black">
        <Ionicons name="alert-circle-outline" size={18} color='#4B5563'/>
        <Text className="text-sm text-lime-500 text-center ml-2">{message}</Text>
        <TouchableOpacity onPress={onClose} className="items-center pl-8">
          <Text className="text-gray-600 text-s">OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default function LogInScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState<boolean>(false); // State for alert visibility
  const [alertMessage, setAlertMessage] = useState<string>(''); // State for alert message

  const { role } = useUserContext();

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
        // Navigate to the interface after successful login
        goToInterface(role);
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
    <ThemedView className="flex-1 justify-center w-full px-8">
      <Container>
        <TitleComponent />
        {/* Email Input Field */}
        <View className='py-1.5'>
          <View>
            <FontAwesome
              name="envelope-o"
              size={24}
              style={{ position: 'absolute', left: 16, top: 12, color: '#757575', zIndex: 10 }} 
            />
            <TextInput
              className="pl-14 pr-4 py-3 bg-[#F6F5F3] rounded-lg text-[#757575] w-full h-12"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateEmail(email)}
              keyboardType="email-address"
            />
            {emailError ? <Text style={{ color: 'red' }}>{emailError}</Text> : null}
          </View>
        </View>

        {/* Password Input Field */}
        <View className='py-1.5'>
          <View>
            <Feather
              name="lock"
              size={24}
              style={{ position: 'absolute', left: 16, top: 12, color: '#757575', zIndex: 10 }} 
            />
            <TextInput
              className="pl-14 pr-4 py-3 bg-[#F6F5F3] rounded-lg text-[#757575] w-full h-12"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              onBlur={() => validatePassword(password)}
              secureTextEntry
            />
            {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}
          </View>

        </View>
        {/* Login Button */}
        <LoginButton 
          title="Log In"
          onPress={handleSignIn} 
          variant="primary"
        />
      </Container>

      {/* Sign Up Button */}
      <SignUpButton
        title="Don't have an account? Sign Up"
        onPress={() => router.push("/sign_up")}
        variant="secondary"
      />

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible} 
        message={alertMessage} 
        onClose={() => setAlertVisible(false)} 
      />
    </ThemedView>
  );
}
