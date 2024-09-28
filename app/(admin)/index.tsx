import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { View, Text, Button, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { EcoAction } from '../../types/EcoAction';
import LogOutButton from '../components/LogOutButton';
import { handleBackAction } from '../utils/utils';

const AdminHome = () => {

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction
    );

    // Cleanup function
    return () => backHandler.remove();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text className='text-4xl mt-2'>Welcome, admin!</Text>
      <LogOutButton/>
    </View>
  );
};

export default AdminHome;