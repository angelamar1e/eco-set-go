import React, { useState } from 'react';
import { styled } from "nativewind";
import { Button, Layout } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router'; 

const StyledButton = styled(Button);
const StyledLayout = styled(Layout);

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
      <StyledButton
        className='m-1 p-1 rounded-full'
        style={{ width: 180 }}
        status='basic'
        size='small'
        appearance="outline"
        accessoryLeft={() => (
          <Ionicons name="add" size={20} color="#8F9BB3" />
        )}
        onPress={handlePress}
      >Add action</StyledButton>
    </StyledLayout>
  );
};

export default AddActionButton;
