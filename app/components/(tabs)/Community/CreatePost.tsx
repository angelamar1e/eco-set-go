import React from 'react';
import { Card, Button, Input, Layout } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledCard = styled(Card);
const StyledButton = styled(Button);
const StyledInput = styled(Input);
const StyledLayout = styled(Layout);

export const CreatePost = (): React.ReactElement => {
  const [value, setValue] = React.useState('');

  return (
    <StyledCard className="mt-10 ml-2 mr-2 rounded-lg">
        <StyledInput
          className="flex-1"
          placeholder="Write a post"
          value={value}
          onChangeText={nextValue => setValue(nextValue)}
          multiline={true}
          textStyle={{ minHeight: 50 }}
        />
        <StyledLayout className='flex-row justify-end'>
          <StyledButton 
            className="mt-2 rounded-full"
            size='small'
            appearance="filled">
            Post
          </StyledButton>
        </StyledLayout>
        
    </StyledCard>
  );
};

export default CreatePost;
