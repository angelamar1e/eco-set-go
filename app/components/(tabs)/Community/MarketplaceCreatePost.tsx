import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import PostButton from './PostButton';

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
    <View className="bg-white p-4 rounded-lg mt-10 mb-2 ml-2 mr-2">
      <TextInput
        placeholder="Write something..."
        value={newPost}
        onChangeText={setNewPost}
        className="bg-gray-100 p-2 rounded-full mb-2"
      />
      <View className="flex-row justify-end">
        <PostButton onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default MarketplaceCreatePost;
