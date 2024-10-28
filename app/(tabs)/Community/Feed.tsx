import { styled } from 'nativewind';
import { Text, Layout } from '@ui-kitten/components';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import SearchAndButtons from '@/app/components/(tabs)/Community/SearchAndButtons';
import CommunityPosts from '@/app/components/(tabs)/Community/CommunityPosts';
import MessageFeed from '@/app/components/(tabs)/Community/MessageFeed';
import Marketplace from '@/app/components/(tabs)/Community/Marketplace';
import { PostCard, MarketplacePost } from '@/types/PostCardProps';
import { myTheme } from '@/constants/custom-theme';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

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
    { id: '1', image: 'https://example.com/image1.png', headline: 'Article1', lead: 'Article 1 Lead..', source: 'Source' },
    { id: '2', image: 'https://example.com/image2.png', headline: 'Article2', lead: 'Article 2 Lead..', source: 'Source' },
    { id: '3', image: 'https://example.com/image3.png', headline: 'Article3', lead: 'Article 3 Lead...', source: 'Source' },
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
    <StyledLayout className="flex-1">
        <StyledLayout className='h-1/6 rounded-b-3xl justify-center items-center relative'
          style={{ backgroundColor: myTheme['color-success-700']}}>
         <StyledText category="h4" className='text-white'>Community</StyledText>
        <SearchAndButtons 
          onSearch={(query) => console.log('Searching for:', query)}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
      </StyledLayout>

        

      {renderSelectedComponent()}
    </StyledLayout>
  );
};

export default Feed;