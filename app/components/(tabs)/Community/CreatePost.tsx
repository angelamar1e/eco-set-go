import React from 'react';
import { Card, Button, Select, Input } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledCard = styled(Card);
const StyledButton = styled(Button);
const StyledInput = styled(Input);
const StyledSelect = styled(Select);

export const CreatePost = (): React.ReactElement => {
  const [value, setValue] = React.useState('');

  return (
    <StyledCard className="p-4 mt-10 ml-2 mr-2">
      <StyledInput
        className="w-full m-2"
        placeholder="Create a post"
        value={value}
        onChangeText={nextValue => setValue(nextValue)}
      />
      <StyledButton 
        className="w-1/2 m-2 items-center justify-around"
        appearance="filled">
        Post
      </StyledButton>
    </StyledCard>
  );
};

export default CreatePost;
