import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MarketplacePost } from '@/types/PostCardProps';

interface MarketplacePostProps extends MarketplacePost {
  id: string; // Include id here if you need it
}

const MarketplacePostCard: React.FC<MarketplacePostProps> = ({
  id, // Destructure id if you need to use it
  content,
  userName,
  userHandle,
  userIcon,
  contactNumber,
  price,
}) => {
  const [comment, setComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isHearted, setIsHearted] = useState(false);

  const handleCommentSubmit = () => {
    if (comment.trim() === '') {
      console.log('Comment cannot be empty');
      return; // Prevent empty submissions
    }
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
          <Text className="font-bold">{userName}</Text>
          <Text className="text-gray-500">{userHandle}</Text>
        </View>
      </View>

      <View className="mt-2">
        <Text className="text-base">{content}</Text>
        <Text className="text-green-600 font-bold mt-1">{price}</Text>
        <Text className="text-gray-500">Contact: {contactNumber}</Text>
        {/* Add link or additional functionality here */}
      </View>

      <View className="flex-row flex-1 items-center border border-gray-300 rounded-full ml-2">
        <TextInput
          className="flex-1 p-2 h-10"
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isFocused && (
          <TouchableOpacity onPress={handleCommentSubmit} className="p-2">
            <Ionicons name="arrow-up-circle" size={24} color="#34C759" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MarketplacePostCard;
