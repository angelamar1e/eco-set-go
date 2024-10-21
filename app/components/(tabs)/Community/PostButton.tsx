import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface PostButtonProps {
  onPress: () => void; 
}

const PostButton: React.FC<PostButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className="bg-[#34C759] h-8 w-[25%] items-center rounded-full justify-center" 
    >
      <ThemedText type='default' className="text-white">Post</ThemedText> 
    </TouchableOpacity>
  );
};

export default PostButton;
