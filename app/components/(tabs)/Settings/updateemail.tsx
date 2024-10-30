import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { Layout, Input, Button, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from "@/contexts/UserContext";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const UpdateEmail = () => {
  const {userUid} = useUserContext();
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const router = useRouter();

  const fetchUserEmail = async (userUid: string) => {
    try {
      const userDoc = await firestore().collection('users').doc(userUid).get();
      if (userDoc.exists) {
        setCurrentEmail(userDoc.data()?.email);
      }
    } catch (error) {
      console.error('Error fetching email: ', error);
    }
  };

  const handleUpdate = async () => {
    if (newEmail) {
      try {
        await firestore().collection('users').doc(userUid).update({ email: newEmail });
        setCurrentEmail(newEmail);
        setNewEmail("");
      } catch (error) {
        console.error('Error updating email: ', error);
      }
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
        fetchUserEmail(userUid);
    };

    fetchUserDetails();
  }, []);

  return (
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
        <StyledText category="s1" className="p-1">{currentEmail}</StyledText>
        <StyledText category="s1" className="font-bold p-1">New Email Address:</StyledText>
        <StyledInput
          value={newEmail}
          status="basic"
          onChangeText={setNewEmail}
          placeholder="Enter your new email"
        />
      </StyledLayout>
    </StyledLayout>
  );
};

export default UpdateEmail;
