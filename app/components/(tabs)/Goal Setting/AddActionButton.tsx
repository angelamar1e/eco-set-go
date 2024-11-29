import React, { useState } from 'react';
import { styled } from "nativewind";
import { Button, Layout, Text } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router'; 
import { TouchableOpacity } from 'react-native';

const StyledButton = styled(Button);
const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const AddActionButton = () => {
  const [isClicked, setIsClicked] = useState(false); 
  const router = useRouter(); 

  const handlePress = () => {
    setIsClicked(true);
    console.log('Add Action Pressed');
    
    setTimeout(() => {
      setIsClicked(false);
      router.push('/(tabs)/Eco Articles/list');
    }, 200);
  };

  return (
    <StyledLayout>
      <TouchableOpacity 
        className='m-1 p-1 rounded-full flex-row items-center justify-center border border-[#8F9BB3]'
        style={{ width: 180, backgroundColor: '#F5F7F9' }}
        onPress={handlePress}
      >
        <Ionicons name="add" size={20} color="#8F9BB3" />
        <StyledText 
          style={{ 
            fontFamily: 'Poppins-Medium',
            color: '#8F9BB3',
            marginLeft: 8,
            fontSize: 12,
            alignContent: 'center',
            justifyContent: 'center',
            top: 2
          }}
        >
          Add action
        </StyledText>
      </TouchableOpacity>
    </StyledLayout>
  );
};

export default AddActionButton;
