import React from 'react';
import { Image } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';

interface MessageCardProps {
  recipientName: string;
  recipientHandle: string; 
  recipientIcon: string;
  latestMessage: string;
  latestMessageDate: string; 
}

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const MessageCard: React.FC<MessageCardProps> = ({
  recipientName,
  recipientHandle,
  recipientIcon,
  latestMessage,
  latestMessageDate,
}) => {
  return (
    <StyledLayout className="flex-row items-center p-4 rounded-lg shadow">
      {/* Recipient Icon */}
      <Image
        source={{ uri: recipientIcon }}
        className="w-10 h-10 rounded-full mr-4"
        alt={`${recipientName}'s icon`}
      />
      
      {/* Name, handle, and latest message */}
      <StyledLayout className="flex-1 p-2">
        <StyledText category="s1">
          {recipientName} 
          <StyledText category="s1"> @{recipientHandle}</StyledText>
          <StyledText category="s1"> {latestMessageDate}</StyledText>
        </StyledText>
        <StyledText category="p1" numberOfLines={1} ellipsizeMode="tail">
          {latestMessage}
        </StyledText>
      </StyledLayout>
    </StyledLayout>
  );
};

export default MessageCard;
