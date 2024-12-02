import React from "react";
import { View, FlatList, Text } from "react-native";
import MessageCard from "./MessageCard";
import { myTheme } from "@/constants/custom-theme";

interface Message {
  id: string;
  recipientName: string;
  recipientHandle: string;
  recipientIcon: string;
  latestMessage: string;
  latestMessageDate: string;
}

interface MessageFeedProps {
  messages: Message[];
}

const MessageFeed: React.FC<MessageFeedProps> = ({ messages }) => {
  return (
    <View className="relative flex-1">
      {/* The semi-transparent overlay view */}
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-gray-700 opacity-50 z-30"></View>
      {/* Text on top of the overlay */}
      <Text className="absolute top-[280px] left-0 right-0 z-40 text-white text-3xl text-center" style={{color: myTheme["color-success-300"], fontFamily: "Poppins-Bold"}}>
        🔐{"\n"}Feature{"\n"}Locked
      </Text>

      <View className="mt-20 h-screen">
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
    </View>
  );
};

export default MessageFeed;
