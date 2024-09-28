import React from 'react';
import { handleLogOut } from '../utils/utils';
import { Button } from 'react-native-paper';

const LogOutButton = () => {
  return (
    <Button onPress={handleLogOut} mode='contained' icon="key" style={{ position: 'absolute', bottom: 40, right: 20, borderRadius: 50 }}>Log Out</Button>
  );
};

export default LogOutButton