import React, { useState, useEffect } from 'react';
import { Text, Layout } from '@ui-kitten/components';
import { styled } from 'nativewind';
import Preferences from '@/app/components/(tabs)/Settings/Preferences';
import Details from '@/app/components/(tabs)/Settings/Details';
import SettingsTab from '@/app/components/(tabs)/Settings/SettingsTab';
import firestore from '@react-native-firebase/firestore';
import { myTheme } from "@/constants/custom-theme";
import { useUserContext } from '@/contexts/UserContext';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const setting = () => {
  const [selectedTab, setSelectedTab] = useState<'Details' | 'Preferences'>('Details');
  const [pushNotifications, setPushNotifications] = useState(false);
  const [actionReminders, setActionReminders] = useState(false);
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('••••••••');
  const { userUid, username } = useUserContext();
  
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
      const { userUid } = useUserContext();
      if (userUid) {
        fetchEmail(userUid);
        fetchPassword(userUid);
      }
    };

    fetchUserDetails();
  }, []);
  
  return (
    <StyledLayout className="flex-1">
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
            <Preferences
            pushNotifications={pushNotifications}
            setPushNotifications={setPushNotifications}
            actionReminders={actionReminders}
            setActionReminders={setActionReminders}
            />
        )}    
        </StyledLayout>

    </StyledLayout>
  );
};

export default setting;
