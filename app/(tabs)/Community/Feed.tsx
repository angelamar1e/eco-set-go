import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchAndButtons from '@/app/components/(tabs)/Community/SearchAndButtons';
import CommunityPosts from '@/app/components/(tabs)/Community/CommunityPosts';
import MessageFeed from '@/app/components/(tabs)/Community/MessageFeed';
import Marketplace from '@/app/components/(tabs)/Community/Marketplace';
import { PostCard, MarketplacePost } from '@/types/PostCardProps';

const Feed: React.FC = () => {
  const navigation = useNavigation();
  
  // Posts
  const [posts, setPosts] = useState<PostCard[]>([
    { id: '1', content: 'Hello', userName: 'Name', userHandle: 'username', userIcon: 'https://example.com/icon1.png' },
    { id: '2', content: 'Hi!', userName: 'Name', userHandle: 'username', userIcon: 'https://example.com/icon2.png' },
    { id: '3', content: 'Sample!', userName: 'Name', userHandle: 'username', userIcon: 'https://example.com/icon2.png' },
  ]);

  // EcoNews data
  const [ecoNews, setEcoNews] = useState([
    { id: '1', image: 'https://example.com/image1.png', headline: 'Eco-friendly Initiative', lead: 'A new initiative has been launched...', source: 'EcoNews Daily' },
    { id: '2', image: 'https://example.com/image2.png', headline: 'Renewable Energy Trends', lead: 'Recent trends in renewable energy...', source: 'Green World News' },
    { id: '3', image: 'https://example.com/image3.png', headline: 'Sustainable Living', lead: 'Tips for living sustainably...', source: 'Nature Magazine' },
  ]);

  // State for Message Cards
  const [messages, setMessages] = useState([
    { id: '1', recipientName: 'User1', recipientHandle: 'handle1', recipientIcon: 'https://example.com/picture.png', latestMessage: 'Hi', latestMessageDate: '2024-10-16' },
    { id: '2', recipientName: 'User2', recipientHandle: 'handle2', recipientIcon: 'https://example.com/picture.png', latestMessage: 'Hello', latestMessageDate: '2024-10-15' },
    { id: '3', recipientName: 'User3', recipientHandle: 'handle3', recipientIcon: 'https://example.com/picture.png', latestMessage: 'Hello', latestMessageDate: '2024-10-14' },
  ]);

  // Additional state for Marketplace posts
  const [marketplacePosts, setMarketplacePosts] = useState<MarketplacePost[]>([
    {
      id: '1',
      content: 'Surplus Crops',
      userName: 'Crops',
      userHandle: '@surplus',
      userIcon: 'https://example.com/crops.png',
      contactNumber: '123-456-7890',
      price: '200',
    },
    {
      id: '2',
      content: 'Surplus Crops',
      userName: 'Crops',
      userHandle: '@surplus',
      userIcon: 'https://example.com/crops.png',
      contactNumber: '123-456-7890',
      price: '200',
    },
  ]);
  
  const [newPost, setNewPost] = useState('');
  const [selectedButton, setSelectedButton] = useState<string | null>('list'); 

  // Handle creating a post for Main Feed
  const handleCreatePost = () => {
    if (newPost.trim()) {
      const newPostData: PostCard = {
        id: (posts.length + 1).toString(),
        content: newPost,
        userName: 'Current User',
        userHandle: 'current_user',
        userIcon: 'https://example.com/user_icon.png',
      };
      setPosts([newPostData, ...posts]);
      setNewPost('');
    }
  };

  // Handle creating a post for Marketplace
  const handleCreateMarketplacePost = (contactNumber: string, price: string) => {
    if (newPost.trim()) {
      const newMarketplacePost: MarketplacePost = {
        id: (marketplacePosts.length + 1).toString(),
        content: newPost,
        userName: 'Current User',
        userHandle: 'current_user',
        userIcon: 'https://example.com/user_icon.png',
        contactNumber,
        price,
      };
      setMarketplacePosts([newMarketplacePost, ...marketplacePosts]);
      setNewPost('');
    }
  };

  const renderSelectedComponent = () => {
    switch (selectedButton) {
      case 'list':
        return (
          <CommunityPosts
            posts={posts}
            ecoNews={ecoNews}
            newPost={newPost}
            setNewPost={setNewPost}
            handleCreatePost={handleCreatePost}
          />
        );
      case 'chat':
        return (
          <MessageFeed messages={messages} /> 
        );
      case 'cart':
        return (
          <Marketplace 
            posts={marketplacePosts} 
            newPost={newPost}
            setNewPost={setNewPost}
            handleCreateMarketplacePost={handleCreateMarketplacePost} 
          />
        );
      default:
        return null; 
    }
  };

  return (
    <View className="flex-1">
      <View className="absolute top-0 left-0 right-0 z-10 bg-lime-800 h-1/4 rounded-b-3xl justify-center items-center relative">
        <ThemedText type='subtitle' className='text-[28px] text-gray-100 mb-2'>Community</ThemedText>
        <ThemedText type='default' className='text-[15px] text-gray-100'>Date</ThemedText> 

        <SearchAndButtons 
          onSearch={(query) => console.log('Searching for:', query)}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
      </View>

      {renderSelectedComponent()}
    </View>
  );
};

export default Feed;
