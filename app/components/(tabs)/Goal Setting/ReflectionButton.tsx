import React from 'react';
import { Button, Text, Layout } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledButton = styled(Button);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);

const ReflectionButton = () => {
  return (
    <StyledLayout>
      <StyledButton
        className='m-1 p-1 rounded-full'
        status='success'
        size='medium'
        appearance='filled'
        onPress={() => { console.log('Write reflection entry pressed'); }}
      >
        <StyledText category='label' className="text-center">
          Write an entry
        </StyledText>
      </StyledButton>
    </StyledLayout>
  );
};

export default ReflectionButton;