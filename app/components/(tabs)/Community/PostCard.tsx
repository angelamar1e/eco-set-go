import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text } from '@ui-kitten/components'

interface PostCardProps {
  content: string;
  userName: string;
  userHandle: string; 
  userIcon: string; 
}

const PostCard: React.FC<PostCardProps> = ({ content, userName, userHandle, userIcon }) => {
  const [comment, setComment] = useState('');
  const [isFocused, setIsFocused] = useState(false); 
  const [isHearted, setIsHearted] = useState(false); 

  const handleCommentSubmit = () => {
    console.log('Comment submitted:', comment);
    setComment('');
  };

  const handleHeartPress = () => {
    setIsHearted(!isHearted); 
    console.log('Heart pressed!');
  };

  return (
    <View className="bg-white p-4 rounded-lg mb-2 ml-2 mr-2">
      <View className="flex-row items-center">
        <Image
          source={{ uri: userIcon }}
          className="w-8 h-8 rounded-full mr-2"
          alt="User Icon"
        />
        <View>
          <ThemedText type='default' className="font-bold">{userName}</ThemedText>
          <ThemedText type='default' className="text-gray-500">@{userHandle}</ThemedText>
        </View>
      </View>

      <View className="mt-2">
        <ThemedText type='default'>{content}</ThemedText>
      </View>

      <View className="flex-row items-center justify-center mt-4">
        {/* Heart button */}
        <TouchableOpacity onPress={handleHeartPress} className="p-2">
          <Ionicons 
            name={isHearted ? "heart" : "heart-outline"} 
            size={24} 
            color={isHearted ? "#34C759" : "#A9A9A9"} 
          />
        </TouchableOpacity>

        <View className="flex-row flex-1 items-center border border-gray-300 rounded-full ml-2">
          {/* Comment Input */}
          <TextInput
            className="flex-1 p-2 h-10" 
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
            onFocus={() => setIsFocused(true)} // Set focus state to true on focus
            onBlur={() => setIsFocused(false)} // Set focus state to false on blur
          />
          {/* Conditionally render the arrow-up icon based on focus state */}
          {isFocused && (
            <TouchableOpacity onPress={handleCommentSubmit} className="p-2">
              <Ionicons name="arrow-up-circle" size={24} color="#34C759" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;
