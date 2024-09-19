import React from 'react';
import auth from '@react-native-firebase/auth';
import { CTAButton } from './CTAButton';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await auth().signOut();

    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <CTAButton title='Log Out' onPress={handleLogout} variant='primary'/>
  );
};

export default LogoutButton