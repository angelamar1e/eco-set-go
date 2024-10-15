import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/app/(tabs)/Community/Feed';

type CreatePostScreenProps = NativeStackScreenProps<RootStackParamList, 'CreatePost'>;

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const [postContent, setPostContent] = useState<string>('');

  const handleCreatePost = () => {
    // This is where you'd handle the logic to add a post.
    // For now, just navigate back to the Home screen.
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-bold mb-2">Create a New Post</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-4"
        placeholder="What's on your mind?"
        value={postContent}
        onChangeText={setPostContent}
      />
      <TouchableOpacity
        className="bg-blue-500 p-2 rounded-lg"
        onPress={handleCreatePost}
      >
        <Text className="text-white text-center">Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreatePostScreen;
