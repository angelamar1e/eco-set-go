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

  return (
    <StyledLayout className="p-2 m-2">
      <StyledLayout className='p-1'>
        <StyledText category="h6" className="mb-2">Username</StyledText>
        <StyledButton 
          onPress={() => router.push('/components/Settings/updateusername')}
          className="flex flex-row justify-between items-center"
          status="basic"
          accessoryRight={<Ionicons name="chevron-forward-outline" size={20} color="dark-gray" />}>
          {username}
        </StyledButton>
      </StyledLayout>

      <StyledLayout className='p-1'>
      <StyledText category="h6" className="mb-2">Email Address</StyledText>
        <StyledButton 
          onPress={() => router.push('/components/Settings/updateemail')}
          className="flex flex-row justify-between items-center"
          status="basic"
          accessoryRight={<Ionicons name="chevron-forward-outline" size={20} color="dark-gray"  />}>
          {email}
        </StyledButton>
      </StyledLayout>

      <StyledLayout className='p-1'>
      <StyledText category="h6" className="mb-2">Password</StyledText>
        <StyledButton 
          onPress={() => router.push('/components/Settings/updatepassword')}
          className="flex flex-row justify-between items-center"
          status="basic"
          accessoryRight={<Ionicons name="chevron-forward-outline" size={20} color="dark-gray"  />}>
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
