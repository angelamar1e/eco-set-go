import React from 'react';
import { styled } from "nativewind";
import { Button, Layout, Text } from '@ui-kitten/components';

const StyledButton = styled(Button);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);

const AddActionButton = () => {
  return (
    <StyledLayout>
      <StyledButton
        className='m-1 p-1 rounded-full'
        status='success'
        size='small'
        appearance='filled'
        onPress={() => {
          console.log('Add Action Pressed');
        }}
        >
        <StyledText category='label'>
          Add an action
        </StyledText>

      </StyledButton>
    </StyledLayout>
  
  );
};

export default AddActionButton;