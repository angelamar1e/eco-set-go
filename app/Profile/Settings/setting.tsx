import React, { useState, useEffect } from 'react';
import { Text, Layout, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import Preferences from '@/app/components/(tabs)/Settings/Preferences';
import Details from '@/app/components/(tabs)/Settings/Details';
import SettingsTab from '@/app/components/(tabs)/Settings/SettingsTab';
import firestore from '@react-native-firebase/firestore';
import { getUserUid } from '@/app/utils/utils';
import { myTheme } from "@/constants/custom-theme";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledButton = styled(Button);

const settings = () => {
  const [selectedTab, setSelectedTab] = useState<'Details' | 'Preferences'>('Details');
  const [pushNotifications, setPushNotifications] = useState(false);
  const [actionReminders, setActionReminders] = useState(false);
  const [username, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('••••••••');

  const router = useRouter();

  // Function to get the username from Firestore
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
  
  // Function to get the email from Firestore
  const fetchEmail = async (userUid: string) => {
      try {
        const userDoc = await firestore().collection('users').doc(userUid).get();
        if (userDoc.exists) {
          setEmail(userDoc.data()?.email);
        }
      } catch (error) {
        console.error('Error fetching email: ', error);
      }
  };
  
  // Function to get the password from Firestore
  const fetchPassword = async (userUid: string) => {
      try {
        const userDoc = await firestore().collection('users').doc(userUid).get();
        if (userDoc.exists) {
          const passwordData = userDoc.data()?.password;
          setPassword(passwordData ? '•'.repeat(passwordData.length) : '••••••••');
        }
      } catch (error) {
        console.error('Error fetching password: ', error);
      }
  };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const uid = await getUserUid();
      if (uid) {
        fetchUserName(uid);
        fetchEmail(uid);
        fetchPassword(uid);
      }
    };

    fetchUserDetails();
  }, []);
  
  return (
    <StyledLayout className='flex-1'>
      
      <StyledLayout className='h-1/6 rounded-b-3xl justify-center items-center relative'
          style={{ backgroundColor: myTheme['color-success-700']}}>
         <StyledText category="h4" className='text-white'>Settings</StyledText>
      </StyledLayout>

      <StyledLayout className="ml-2 mr-2">
        <SettingsTab 
          selectedTab={selectedTab} 
          setSelectedTab={setSelectedTab}
        />
      </StyledLayout>
      
      <StyledLayout className="mt-5">
        {selectedTab === 'Details' ? (
            <Details 
                username={username}
                email={email}
                password={password}
            />
        ) : (
            <Preferences/>
        )}    
      </StyledLayout>
    </StyledLayout>
  );
};

export default settings;
