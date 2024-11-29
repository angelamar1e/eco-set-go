import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { myTheme } from '@/constants/custom-theme';

interface MessageCardProps {
  recipientName: string;
  recipientHandle: string; 
  recipientIcon: string;
  latestMessage: string;
  latestMessageDate: string;
  onPress?: () => void;
}

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const MessageCard: React.FC<MessageCardProps> = ({
  recipientName,
  recipientHandle,
  recipientIcon,
  latestMessage,
  latestMessageDate,
  onPress
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="mx-2 my-1"
    >
      <StyledLayout 
        className="flex-row items-center p-4 rounded-lg"
        style={{
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: myTheme['color-basic-300']
        }}
      >
        {/* Recipient Icon */}
        <Image
          source={{ uri: recipientIcon }}
          className="w-12 h-12 rounded-full mr-3"
          alt={`${recipientName}'s icon`}
        />
        
        {/* Content Container */}
        <StyledLayout className="flex-1">
          {/* Header Row */}
          <StyledLayout className="flex-row items-center justify-between mb-1">
            <StyledLayout className="flex-row items-center">
              <StyledText 
                style={{ 
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  color: myTheme['color-basic-800']
                }}
              >
                {recipientName}
              </StyledText>
              <StyledText 
                style={{ 
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  color: myTheme['color-basic-600'],
                  marginLeft: 4
                }}
              >
                @{recipientHandle}
              </StyledText>
            </StyledLayout>
            
            {/* Date */}
            <StyledText 
              style={{ 
                fontFamily: 'Poppins-Regular',
                fontSize: 11,
                color: myTheme['color-basic-500']
              }}
            >
              {latestMessageDate}
            </StyledText>
          </StyledLayout>

          {/* Message Preview */}
          <StyledText 
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ 
              fontFamily: 'Poppins-Regular',
              fontSize: 13,
              color: myTheme['color-basic-600'],
              lineHeight: 18
            }}
          >
            {latestMessage}
          </StyledText>
        </StyledLayout>
      </StyledLayout>
    </TouchableOpacity>
  );
};

export default MessageCard;
