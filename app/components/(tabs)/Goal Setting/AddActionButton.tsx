import React, { useState } from 'react';
import { styled } from "nativewind";
import { Button, Layout, Text } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router'; 
import { TouchableOpacity } from 'react-native';
import { myTheme } from '@/constants/custom-theme';

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
        className='m-1 p-1 rounded-2xl flex-row items-center justify-center h-[42px] border-[#8F9BB3]'
        style={{ backgroundColor: '#F5F7F9', borderWidth:1, borderColor: myTheme['color-success-700']}}
        onPress={handlePress}
      >
        <Ionicons name="add" size={20} color= {myTheme['color-success-700']} />
        <StyledText 
          style={{ 
            fontFamily: 'Poppins-Medium',
            color: myTheme['color-success-700'],
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
