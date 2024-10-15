import React from 'react';
import { View, Text } from 'react-native';

interface PostCardProps {
  content: string;
}

const PostCard: React.FC<PostCardProps> = ({ content }) => {
  return (
    <View className="bg-gray-100 p-4 rounded-lg mb-2">
      <Text className="text-base">{content}</Text>
    </View>
  );
};

export default PostCard;
