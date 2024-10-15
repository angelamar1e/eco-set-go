import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Message {
  id: string;
  userName: string;
  content: string;
}

const initialMessages: Message[] = [
  { id: '1', userName: 'User 1', content: 'Hello, how are you?' },
  { id: '2', userName: 'User 2', content: 'I am fine, thank you!' },
  { id: '3', userName: 'User 1', content: 'What about you?' },
];

const MessageFeed: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageData: Message = {
        id: (messages.length + 1).toString(),
        userName: 'Current User',
        content: newMessage,
      };
      setMessages((prevMessages) => [...prevMessages, newMessageData]);
      setNewMessage('');
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View className="bg-white rounded-lg shadow p-4 mb-2">
      <Text className="font-semibold">{item.userName}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <View className="flex-1 mt-10 p-4 bg-gray-100">
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View className="flex-row mt-4">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg p-2"
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} className="bg-lime-800 rounded-lg p-2 ml-2">
          <Ionicons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageFeed;
