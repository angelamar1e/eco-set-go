import React from 'react';
import { Text, Button, Layout } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { handleLogOut } from '@/app/utils/utils';
import { myTheme } from '@/constants/custom-theme';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';

const StyledText = styled(Text);
const StyledButton = styled(Button);
const StyledLayout = styled(Layout);

interface DetailsProps {
  username: string;
  password: string;
}

const Details: React.FC<DetailsProps> = ({
  username,
  password,
}) => {

  const router = useRouter();
  const [currentEmail, setCurrentEmail] = useState("");
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchUserEmail();
  }, []);

  return (
    <StyledLayout className="p-2 m-2">
      <StyledLayout className='p-1'>
        <StyledText category="h6" className="mb-2">Username</StyledText>
        <StyledButton 
          onPress={() => router.push('/components/Settings/UpdateUsername')}
          className="flex flex-row justify-between items-center rounded-xl"
          style={{ backgroundColor: myTheme['color-basic-200'], borderColor: myTheme['color-basic-600']}}
          status='basic' 
          accessoryRight={<Ionicons name="chevron-forward-outline" size={20} color="#8F9BB3" />}>
            <StyledText>{username}</StyledText>
        </StyledButton>
      </StyledLayout>

      <StyledLayout className='p-1'>
        <StyledText category="h6" className="mb-2">Email Address</StyledText>
        <StyledButton 
          onPress={() => router.push('/components/Settings/updateemail')}
          className="flex flex-row justify-between items-center rounded-xl"
          style={{ backgroundColor: myTheme['color-basic-200'], borderColor: myTheme['color-basic-600']}}
          status='basic' 
          accessoryRight={<Ionicons name="chevron-forward-outline" size={20} color="#8F9BB3" />}>
          <StyledText>{currentEmail}</StyledText>
        </StyledButton>
      </StyledLayout>

      <StyledLayout className='p-1'>
        <StyledText category="h6" className="mb-2">Password</StyledText>
        <StyledButton 
          onPress={() => router.push('/components/Settings/updatepassword')}
          className="flex flex-row justify-between items-center rounded-xl"
          style={{ backgroundColor: myTheme['color-basic-200'], borderColor: myTheme['color-basic-600'] }}
          status='basic' 
          accessoryRight={<Ionicons name="chevron-forward-outline" size={20} color="#8F9BB3" />}>
          {password}
        </StyledButton>
      </StyledLayout>

      <StyledLayout className='flex-row justify-center items-center mt-5'
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          top: 20,
          borderTopColor: myTheme["color-success-900"],
        }}
      >
        <StyledLayout className="items-center">
          <Button
            style={{
              borderRadius: 100,
              marginHorizontal: 8,
              borderWidth: 1,
              paddingHorizontal: 50,
              paddingVertical: 10
            }}
            onPress={() => router.push('/(tabs)/Home')}
          >
            <MaterialCommunityIcons name='home' size={18}>
            <Text category='label' className="items-center" style={{ color: '', textAlign: 'center', fontSize: 12 }}> Return to Home </Text></MaterialCommunityIcons>
          </Button> 
        </StyledLayout>

        <StyledLayout className="">
          <Button
            style={{
              borderColor: myTheme['color-success-700'],        
              borderRadius: 100,
              marginHorizontal: 8,
              borderWidth: 1,
              paddingHorizontal: 20,
              paddingVertical: 10
            }}
            onPress={handleLogOut}
            appearance= "ghost" 
          >
            <MaterialCommunityIcons name='logout' size={18} color={''}>
            <Text category='label' className="items-center" style={{ color: '', textAlign: 'center', fontSize: 12 }}> Log Out </Text></MaterialCommunityIcons>
          </Button> 
        </StyledLayout>
      </StyledLayout>
    </StyledLayout>
  );
};

export default Details;
