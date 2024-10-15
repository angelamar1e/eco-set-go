import React from 'react';
import { View, FlatList } from 'react-native';
import MarketplacePostCard from './MarketplacePostCard';
import MarketplaceCreatePost from './MarketplaceCreatePost';
import { MarketplacePost } from '@/types/PostCardProps';

interface MarketplaceProps {
  posts: MarketplacePost[]; // Using MarketplacePost type
  newPost: string;
  setNewPost: (text: string) => void;
  handleCreateMarketplacePost: (contactNumber: string, price: string) => void; 
}

const Marketplace: React.FC<MarketplaceProps> = ({
  posts,
  newPost,
  setNewPost,
  handleCreateMarketplacePost,
}) => {
  return (
    <View className="flex-1">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MarketplacePostCard 
            id={item.id}
            content={item.content}
            userName={item.userName}
            userHandle={item.userHandle}
            userIcon={item.userIcon}
            contactNumber={item.contactNumber}
            price={item.price}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <MarketplaceCreatePost 
            newPost={newPost}
            setNewPost={setNewPost}
            handleCreateMarketplacePost={handleCreateMarketplacePost}
          />
        }
      />
    </View>
  );
};

export default Marketplace;
