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

const UpdateUsername = () => {
  const {userUid, username} = useUserContext();
  const [newUsername, setNewUsername] = useState("");
  const router = useRouter();

  const handleUpdate = async () => {
    if (newUsername) {
      try {
        await firestore().collection('users').doc(userUid).update({ username: newUsername });
        setNewUsername(""); // Clear the input after updating
      } catch (error) {
        console.error('Error updating username: ', error);
      }
    }
  };
  
  return (
    <StyledLayout className="flex-1 mt-4 p-2">
      <StyledLayout className="flex flex-row justify-between p-2 items-center">
        <StyledButton 
          appearance="ghost" 
          onPress={() => router.back()}
          className="m-1 p-1 rounded-full">
          Cancel
        </StyledButton>
        <StyledText category="h6">Update Username</StyledText>
        <StyledButton 
          appearance="ghost" 
          onPress={handleUpdate}
          className="m-1 p-1 rounded-full">
          Done
        </StyledButton>
      </StyledLayout>

      <StyledLayout className="flex-1 p-2">
        <StyledText category="s1" className="font-bold p-1">Current Username:</StyledText>
        <StyledText category="s1" className="p-1">{username}</StyledText>
        <StyledText category="s1" className="font-bold p-1">Current Username:</StyledText>
        <StyledInput
          value={newUsername}
          status="basic"
          onChangeText={setNewUsername}
          placeholder="Enter your new username"
        />
      </StyledLayout>
    </StyledLayout>
  );
};

export default UpdateUsername;
