import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { myTheme } from '@/constants/custom-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    <TouchableOpacity onPress={onPress}>
      <StyledLayout 
        className="p-3 mb-5 m-2 rounded-xl border border-gray-200" 
        style={{
          backgroundColor: myTheme['color-basic-200'],
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.15,
          shadowRadius: 2.5,
          elevation: 2,
        }}
      >
        <StyledLayout className="flex-row justify-between" style={{backgroundColor: myTheme['color-basic-200']}}>
          <StyledLayout className='flex-row w-11/12 items-center' style={{backgroundColor: myTheme['color-basic-200']}}>
            <StyledLayout className='flex-row mt-2 items-center w-[240px]' style={{backgroundColor: myTheme['color-basic-200']}}>
              <StyledText className="ml-2 font-bold text-[90px]">
                <MaterialCommunityIcons name='emoticon-excited' size={40} color={myTheme['color-success-700']}/>
              </StyledText>
              <StyledText 
                className="ml-1 text-gray-500 w-full"
                style={{ fontFamily: 'Poppins-Italic', fontSize: 15 }}
              >
                @{recipientHandle}
              </StyledText>
            </StyledLayout>
            <StyledText 
              className="ml-2 text-gray-400 mt-4"  
              style={{
                color: myTheme['color-success-900'],
                fontFamily: 'Poppins-Regular',
                fontSize: 13
              }}
            >
              {latestMessageDate}
            </StyledText>
          </StyledLayout>
        </StyledLayout>

        <StyledLayout className="mt-2 ml-5" style={{backgroundColor: myTheme['color-basic-200']}}>
          <StyledText 
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ 
              fontFamily: 'Poppins-Regular',
              color: myTheme['color-basic-600'],
              lineHeight: 18
            }}
            className="text-lg"
          >
            {latestMessage}
          </StyledText>
        </StyledLayout>
      </StyledLayout>
    </TouchableOpacity>
  );
};

export default MessageCard;
