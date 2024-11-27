import React, { useState } from "react";
import { styled } from "nativewind";
import { Layout, Input, Button, Text, Tooltip } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserContext } from "@/contexts/UserContext";
import { SafeAreaView } from "react-native";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [maskedPassword, setMaskedPassword] = useState("••••••••"); // Default masked password
  const router = useRouter();

  const toggleSecureEntryCurrent = () => {
    setSecureTextEntryCurrent((prev) => !prev);
  };

  const toggleSecureEntryNew = () => {
    setSecureTextEntryNew((prev) => !prev);
  };

  const handleUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (!currentPassword || !newPassword) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user || !user.email) {
        throw new Error("No user found");
      }

      // Reauthenticate user before updating password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.back();
    } catch (error: any) {
      console.error('Error updating password: ', error);
      setError(error.message || "Failed to update password");
    } finally {
      setLoading(false);
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
            disabled={loading}
            className="m-1 p-1 rounded-full">
            {loading ? 'Updating...' : 'Done'}
          </StyledButton>
        </StyledLayout>

        <StyledLayout className="p-2">
          {error && (
            <StyledText status="danger" className="mb-2">
              {error}
            </StyledText>
          )}
          <StyledText category="s1" className="font-bold p-1">Current Password:</StyledText>
          <StyledInput
            value={maskedPassword}
            disabled={true}
            className="rounded-lg bg-gray-100"
            status="basic"
            accessoryRight={() => (
              <Ionicons
                name={'eye-off'}
                style={{ color: '#8F9BB3' }}
              />
            )}
          />
        </StyledLayout>

        <StyledLayout className="p-2">
          <StyledText category="s1" className="font-bold p-1">New Password:</StyledText>
          <StyledInput
            value={newPassword}
            secureTextEntry={secureTextEntryNew}
            status={error ? "danger" : "basic"}
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
            status={error ? "danger" : "basic"}
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
