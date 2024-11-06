import React, { useState } from "react";
import { styled } from "nativewind";
import { Layout, Input, Button, Text, Tooltip } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserContext } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const UpdatePassword = () => {
  const {userUid} = useUserContext();
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntryCurrent, setSecureTextEntryCurrent] = useState(true);
  const [secureTextEntryNew, setSecureTextEntryNew] = useState(true);
  const router = useRouter();

  const toggleSecureEntryCurrent = () => {
    setSecureTextEntryCurrent((prev) => !prev);
  };

  const toggleSecureEntryNew = () => {
    setSecureTextEntryNew((prev) => !prev);
  };

  const handleUpdate = async () => {
    if (newPassword) {
      try {
        // Update password logic here
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        console.error('Error updating password: ', error);
      }
    }
  };

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
          <StyledText category="h6">Update Password</StyledText>
          <StyledButton 
            appearance="ghost" 
            onPress={handleUpdate}
            className="m-1 p-1 rounded-full">
            Done
          </StyledButton>
        </StyledLayout>

        <StyledLayout className="p-2">
          <StyledText category="s1" className="font-bold p-1">Current Password:</StyledText>
          <StyledInput
            value={currentPassword}
            secureTextEntry={secureTextEntryCurrent}
            disabled={true}
            onChangeText={setCurrentPassword}
            className="rounded-lg"
          />
        </StyledLayout>

        <StyledLayout className="p-2">
          <StyledText category="s1" className="font-bold p-1">New Password:</StyledText>
          <StyledInput
            value={newPassword}
            secureTextEntry={secureTextEntryNew}
            status="basic"
            onChangeText={setNewPassword}
            className="rounded-lg"
            placeholder="Enter your new password"
            accessoryRight={() => (
              <Ionicons
                name={secureTextEntryNew ? 'eye-off' : 'eye'}
                onPress={toggleSecureEntryNew}
                style={{ cursor: 'pointer' }}
              />
            )}
          />
        </StyledLayout>

        <StyledLayout className="p-2">
          <StyledText category="s1" className="font-bold p-1">Confirm Password:</StyledText>
          <StyledInput
            value={confirmPassword}
            secureTextEntry={secureTextEntryNew}
            status="basic"
            onChangeText={setConfirmPassword}
            className="rounded-lg"
            placeholder="Confirm your new password"
            accessoryRight={() => (
              <Ionicons
                name={secureTextEntryNew ? 'eye-off' : 'eye'}
                onPress={toggleSecureEntryNew}
                style={{ cursor: 'pointer' }}
              />
            )}
          />
        </StyledLayout>
      </StyledLayout>
    </SafeAreaView>
  );
};

export default UpdatePassword;
