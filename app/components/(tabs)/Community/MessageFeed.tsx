import React from 'react';
import { View, FlatList } from 'react-native';
import MessageCard from './MessageCard';

interface MessageFeedProps {
  messages: Array<{
    id: string;
    recipientName: string;
    recipientHandle: string;
    recipientIcon: string;
    latestMessage: string;
    latestMessageDate: string;
  }>;
}

const MessageFeed: React.FC<MessageFeedProps> = ({ messages }) => {
  return (
    <View className="mt-10 flex-1">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageCard
            recipientName={item.recipientName}
            recipientHandle={item.recipientHandle}
            recipientIcon={item.recipientIcon}
            latestMessage={item.latestMessage}
            latestMessageDate={item.latestMessageDate}
          />
        )}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 1 }}
      />
    </View>
  );
};

export default MessageFeed;
