import React from 'react';
import { View, TextInput } from 'react-native';
import PostButton from './PostButton';

interface CreatePostProps {
  newPost: string; 
  setNewPost: (text: string) => void; 
  handleCreatePost: () => void; 
}

const CreatePost: React.FC<CreatePostProps> = ({ newPost, setNewPost, handleCreatePost }) => {
  return (
    <View className="bg-white p-4 rounded-lg mt-10 mb-2 ml-2 mr-2">
      <TextInput
        placeholder="Write something..."
        value={newPost}
        onChangeText={setNewPost}
        className="bg-gray-100 p-2 rounded-full mb-2"
      />
      <View className="flex-row justify-end">
        <PostButton onPress={handleCreatePost} />
      </View>
    </View>
  );
};

export default CreatePost;
