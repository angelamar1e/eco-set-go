import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons'; // Import the icon library

interface PostCardProps {
  content: string;
  userName: string;
  userHandle: string; // Username or handle
  userIcon: string; // URL or local path to the user icon image
}

const PostCard: React.FC<PostCardProps> = ({ content, userName, userHandle, userIcon }) => {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = () => {
    console.log('Comment submitted:', comment);
    setComment(''); // Clear the comment input after submission
  };

  return (
    <View className="bg-gray-100 p-4 rounded-lg mb-2">
      <View className="flex-row items-center mb-2">
        <Image
          source={{ uri: userIcon }}
          className="w-8 h-8 rounded-full mr-2" // Adjust size and styling as needed
          alt="User Icon"
        />
        <View>
          <Text className="font-bold">{userName}</Text>
          <Text className="text-gray-500">@{userHandle}</Text>
        </View>
      </View>
      <Text className="text-base">{content}</Text>
      <View className="flex-row items-center mt-2 border border-gray-300 rounded-full">
        {/* Icon on the left */}
        <Ionicons name="chatbubble-outline" size={24} color="#A9A9A9" className="mx-2" />
        <TextInput
          className="flex-1 p-2" // Padding for the TextInput
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        {/* Send button with upwards arrow */}
        <TouchableOpacity onPress={handleCommentSubmit} className="p-2">
          <Ionicons name="arrow-up-circle" size={24} color="#34C759" /> {/* Green color for the icon */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;
