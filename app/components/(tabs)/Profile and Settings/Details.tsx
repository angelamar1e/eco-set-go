import React from 'react';
import { Text, Button, Layout } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { handleLogOut } from '@/app/utils/utils';

const StyledText = styled(Text);
const StyledButton = styled(Button);
const StyledLayout = styled(Layout);

interface DetailsProps {
  username: string;
  email: string;
  password: string;
}

const Details: React.FC<DetailsProps> = ({
  username,
  email,
  password,
}) => {
  const router = useRouter();

  const UpdateUsername = () => {
    router.push('/components/(tabs)/Profile and Settings/UpdateUsername'); // Update with the correct path
  };

  const UpdateEmail = () => {
    router.push('/(tabs)/Home'); // Update with the correct path
  };

  const UpdatePassword = () => {
    router.push('/(tabs)/Home'); // Update with the correct path
  };

  return (
    <StyledLayout className="p-2 m-2">
      <StyledLayout className='p-1'>
        <StyledText category="h6" className="mb-2">Username</StyledText>
        <StyledButton 
          onPress={UpdateUsername} 
          className="flex flex-row justify-between items-center"
          appearance="outline"
          accessoryRight={<Ionicons name="chevron-forward-outline" size={20} color="green" />}>
          {username}
        </StyledButton>
      </StyledLayout>

      <StyledLayout className='p-1'>
      <StyledText category="h6" className="mb-2">Email Address</StyledText>
        <StyledButton 
          onPress={UpdateEmail} 
          className="flex flex-row justify-between items-center"
          appearance="outline"
          accessoryRight={<Ionicons name="chevron-forward-outline" size={20} color="green" />}>
          {email}
        </StyledButton>
      </StyledLayout>

      <StyledLayout className='p-1'>
      <StyledText category="h6" className="mb-2">Password</StyledText>
        <StyledButton 
          onPress={UpdatePassword} 
          className="flex flex-row justify-between items-center"
          appearance="outline"
          accessoryRight={<Ionicons name="chevron-forward-outline" size={20} color="green" />}>
          {password}
        </StyledButton>
      </StyledLayout>

      <StyledLayout className="p-1 mt-10">
        <StyledButton 
          onPress={handleLogOut} 
          status='basic' 
          className='m-1 p-1 rounded-full'>
        <StyledText category='label'>
          Log Out
        </StyledText>
      </StyledButton>
      </StyledLayout>

    </StyledLayout>
  );
};

export default Details;
