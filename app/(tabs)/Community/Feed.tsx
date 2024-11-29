import { styled } from 'nativewind';
import { Text, Layout } from '@ui-kitten/components';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import SearchAndButtons from '@/app/components/(tabs)/Community/SearchAndButtons';
import CommunityPosts from '@/app/components/(tabs)/Community/CommunityPosts';
import MessageFeed from '@/app/components/(tabs)/Community/MessageFeed';
import Marketplace from '@/app/components/(tabs)/Community/Marketplace';
import { myTheme } from '@/constants/custom-theme';
import { FlatList, View } from 'react-native';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const Feed: React.FC = () => {
  const navigation = useNavigation();

  const [messages, setMessages] = useState([
    { id: '1', recipientName: 'User1', recipientHandle: 'handle1', recipientIcon: 'https://example.com/picture.png', latestMessage: 'Hi', latestMessageDate: '2024-10-16' },
    { id: '2', recipientName: 'User2', recipientHandle: 'handle2', recipientIcon: 'https://example.com/picture.png', latestMessage: 'Hello', latestMessageDate: '2024-10-15' },
    { id: '3', recipientName: 'User3', recipientHandle: 'handle3', recipientIcon: 'https://example.com/picture.png', latestMessage: 'Hello', latestMessageDate: '2024-10-14' },
  ]);

  const [selectedButton, setSelectedButton] = useState<string | null>('list'); 

  const renderSelectedComponent = () => {
    switch (selectedButton) {
      case 'list':
        return <CommunityPosts />;
      case 'chat':
        return <MessageFeed messages={messages} />;
      case 'cart':
        return <Marketplace />;
      default:
        return null; 
    }
  };

  return (
    <StyledLayout className="flex-1">
      <StyledLayout 
        className='h-1/6 rounded-b-3xl justify-center items-center absolute top-0 left-0 right-0 z-10'
        style={{ backgroundColor: myTheme['color-success-700'] }}
      >
        <StyledText className="text-white text-2xl" style={{ fontFamily: 'Poppins-SemiBold' }}>
          Community
        </StyledText>
        <SearchAndButtons 
          onSearch={(query) => console.log('Searching for:', query)}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
      </StyledLayout>

      <View style={{ marginTop: '25%', paddingBottom: 50 }}>
        <FlatList
          data={[renderSelectedComponent()]} 
          renderItem={({ item }) => item}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </StyledLayout>
  );
};

export default Feed;
