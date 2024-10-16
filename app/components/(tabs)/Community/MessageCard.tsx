import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View, Image } from 'react-native';

interface MessageCardProps {
  recipientName: string;
  recipientHandle: string; 
  recipientIcon: string;
  latestMessage: string;
  latestMessageDate: string; 
}

const MessageCard: React.FC<MessageCardProps> = ({
  recipientName,
  recipientHandle,
  recipientIcon,
  latestMessage,
  latestMessageDate,
}) => {

  return (
    <View className="flex-row items-center p-4 bg-white">
      {/* Recipient Icon */}
      <Image
        source={{ uri: recipientIcon }}
        className="w-10 h-10 rounded-full mr-4"
        alt={`${recipientName}'s icon`}
      />
      
      {/* Name, handle, and latest message */}
      <View className="flex-1 p-2">
        <ThemedText type="default">
        {recipientName} <ThemedText className="text-gray-500">@{recipientHandle}</ThemedText> 
        <ThemedText className="text-gray-400 text-sm">{latestMessageDate}</ThemedText>
        </ThemedText>
        <ThemedText type="default" numberOfLines={1} ellipsizeMode="tail">
        {latestMessage}
        </ThemedText>
        
      </View>

    </View>
  );
};

export default MessageCard;
