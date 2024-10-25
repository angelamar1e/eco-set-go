import React, { useState } from 'react';
import { styled } from 'nativewind';
import { Card, Button, Input, Layout } from '@ui-kitten/components';

const StyledCard = styled(Card);
const StyledButton = styled(Button);
const StyledInput = styled(Input);
const StyledLayout = styled(Layout);

interface MarketplaceCreatePostProps {
  newPost: string; 
  setNewPost: (text: string) => void; 
  handleCreateMarketplacePost: (contactNumber: string, price: string) => void; 
}

const MarketplaceCreatePost: React.FC<MarketplaceCreatePostProps> = ({
  newPost,
  setNewPost,
  handleCreateMarketplacePost,
}) => {
  const [value, setValue] = React.useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    if (contactNumber && price) {
      handleCreateMarketplacePost(contactNumber, price);
      // Clear inputs after submission
      setNewPost('');
      setContactNumber('');
      setPrice('');
    }
  };

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
      <StyledLayout className="flex-row justify-end">
        <StyledButton 
          className="mt-2 rounded-full"
          status='success'
          size='small'
          appearance="filled"
          onPress={handleSubmit}
        >
          Post
        </StyledButton>
      </StyledLayout>
    </StyledCard>
  );
};

export default MarketplaceCreatePost;
