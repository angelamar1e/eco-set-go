import React from 'react';
import { Card, Button, Select, Input } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { View } from 'react-native';

const StyledCard = styled(Card);
const StyledButton = styled(Button);
const StyledInput = styled(Input);
const StyledSelect = styled(Select);

export const CreatePost = (): React.ReactElement => {
  const [value, setValue] = React.useState('');

  return (
    <StyledCard className="mt-10 ml-2 mr-2">
        <StyledInput
          className="flex-1"
          placeholder="Create a post"
          value={value}
          onChangeText={nextValue => setValue(nextValue)}
        />
        <StyledButton 
          className="mt-2 w-1/4"
          size='small'
          appearance="filled">
          Post
        </StyledButton>
    </StyledCard>
  );
};

export default CreatePost;
