import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import MarketplacePostCard from './MarketplacePostCard';
import CreateMarketplacePost from '@/app/components/(tabs)/Community/MarketplaceCreatePost';
import FilterButtons from '@/app/components/(tabs)/Community/MarketplaceFilterButtons'
import { MarketplacePost } from '@/types/PostCardProps';

interface MarketplaceProps {
  posts: MarketplacePost[];
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
  const [filter, setFilter] = useState<string>('ALL');

  // Filter posts based on selected category
  const filteredPosts = posts.filter((post) => {
    if (filter === 'ALL') return true;
    return post.content.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <View className="flex-1">
      <FlatList
        data={filteredPosts}
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
        style={{ flexGrow: 1 }}
        ListHeaderComponent={
          <>
            <CreateMarketplacePost 
              newPost={newPost}
              setNewPost={setNewPost}
              handleCreateMarketplacePost={handleCreateMarketplacePost}
            />
            <FilterButtons 
              selectedFilter={filter} 
              onFilterChange={setFilter} 
            />
          </>
        }
      />
    </View>
  );
};

export default Marketplace;
