import React, { useState, useEffect } from "react";
import { styled } from "nativewind";
import { Layout, Input, Button, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import firestore from '@react-native-firebase/firestore';
import { getUserUid } from '@/app/utils/utils';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

interface UpdateUsernameProps {
  currentUsername: string;
  setUserName: (username: string) => void; // Added type for setUserName
  onCancel: () => void;                     // Added type for onCancel
  onUpdate: (newUsername: string) => void; // Added type for onUpdate
}

const UpdateUsername: React.FC<UpdateUsernameProps> = ({
  currentUsername,
  setUserName,
  onCancel,
  onUpdate,
}) => {
  const [newUsername, setNewUsername] = useState("");
  const router = useRouter();

  const handleUpdate = () => {
    if (newUsername) {
      onUpdate(newUsername);
      setNewUsername(""); // Clear the input after updating
    }
  };

    const fetchUserName = async (userUid: string) => {
        try {
          const userDoc = await firestore().collection('users').doc(userUid).get();
          if (userDoc.exists) {
            setUserName(userDoc.data()?.username);
          }
        } catch (error) {
          console.error('Error fetching username: ', error);
        }
    };
    

    useEffect(() => {
        const fetchUserDetails = async () => {
          const uid = await getUserUid();
          if (uid) {
            fetchUserName(uid);
          }
        };
    
        fetchUserDetails();
      }, []);

  return (
    <StyledLayout className="flex-1">
      <StyledLayout className="flex flex-row justify-between p-2">
        <StyledButton appearance="ghost" onPress={onCancel}>
          Cancel
        </StyledButton>
        <StyledText category="h6">Update Username</StyledText>
        <StyledButton appearance="ghost" onPress={handleUpdate}>
          Done
        </StyledButton>
      </StyledLayout>
      <StyledLayout className="flex-1 p-2">
        <StyledText category="s1">Current Username:</StyledText>
        <StyledText>{currentUsername}</StyledText>
        <StyledText category="s1">New Username:</StyledText>
        <StyledInput
          value={newUsername}
          onChangeText={setNewUsername}
          placeholder="Enter new username"
        />
      </StyledLayout>
    </StyledLayout>
  );
};

export default UpdateUsername;
