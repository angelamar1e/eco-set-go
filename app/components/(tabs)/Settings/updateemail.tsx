import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { Layout, Input, Button, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from "@/contexts/UserContext";
import { Alert, SafeAreaView } from "react-native";
import { myTheme } from "@/constants/custom-theme";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const UpdateEmail = () => {
  const {userUid} = useUserContext();
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUserEmail = async () => {
    try {
      const user = auth().currentUser;
      if (user?.email) {
        setCurrentEmail(user.email);
      } else {
        setError("Unable to fetch current email");
      }
    } catch (err) {
      console.error('Error fetching email: ', err);
      setError("Failed to fetch email");
    }
  };

  const handleUpdate = async () => {
    if (!newEmail) {
      Alert.alert("⚠️","Please enter a valid email address.")
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = auth().currentUser;
      if (!user) throw new Error('No user logged in');
      
      Alert.alert("👩‍💻", "Sorry, this feature is still in development.")
      // await user.verifyBeforeUpdateEmail(newEmail);
      // setError("Please check your new email for verification link before the change takes effect");
      
      setNewEmail("");
    } catch (error: any) {
      console.error('Error updating email: ', error);
      setError(error.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEmail();
  }, []);

  return (
    <SafeAreaView className="flex-1 pt-6">
      <StyledLayout className="flex-1 mt-4 p-2">
        <StyledLayout className="flex flex-row justify-between p-2 items-center">
          <StyledButton 
            appearance="ghost" 
            onPress={() => router.back()}
            className="m-1 p-1 rounded-full">
            Cancel
          </StyledButton>
          <StyledText category="h6">Update Email Address</StyledText>
          <StyledButton 
            appearance="ghost" 
            onPress={handleUpdate}
            className="m-1 p-1 rounded-full">
            Done
          </StyledButton>
        </StyledLayout>

        <StyledLayout className="flex-1 p-2">
          <StyledText category="s1" className="font-bold p-1">Current Email Address:</StyledText>
          <StyledText category="s1" className="p-1 border rounded-lg p-3"
            style={{
              borderColor: myTheme['color-basic-600'],
              backgroundColor: myTheme['color-basic-200'],
              color: myTheme['color-basic-600'],
            }}
          >
            {currentEmail}
          </StyledText>
          <StyledText category="s1" className="font-bold p-1 mt-5">New Email Address:</StyledText>
          <StyledInput
            value={newEmail}
            status="basic"
            onChangeText={setNewEmail}
            placeholder="Enter your new email"
            className="rounded-lg"
          />
        </StyledLayout>
      </StyledLayout>
    </SafeAreaView>
  );
};

export default UpdateEmail;
