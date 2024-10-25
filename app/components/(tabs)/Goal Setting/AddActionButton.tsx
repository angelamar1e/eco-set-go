import React, { useState } from 'react';
import { styled } from "nativewind";
import { Button, Layout } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StyledButton = styled(Button);
const StyledLayout = styled(Layout);

const AddActionButton = () => {
  const [isClicked, setIsClicked] = useState(false); 

  const handlePress = () => {
    setIsClicked(!isClicked); 
    console.log('Add Action Pressed');
  };

  const iconColor = isClicked ? "white" : "#8F9BB3"; 

  return (
    <StyledLayout>
      <StyledButton
        className='m-1 p-1 rounded-full'
        status={isClicked ? 'success' : 'basic'} 
        size='small'
        appearance={isClicked ? "filled" : "outline"}
        accessoryLeft={() => (
          <Ionicons name="add" size={20} color={iconColor} />
        )}
        onPress={handlePress}
      />
    </StyledLayout>
  );
};

export default AddActionButton;
