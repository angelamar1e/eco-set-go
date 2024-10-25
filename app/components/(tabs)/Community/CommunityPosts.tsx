import React from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import EcoNewsCard from './EcoNewsCard';

interface CommunityPostsProps {
  posts: Array<{ id: string; content: string; userName: string; userHandle: string; userIcon: string; }>;
  ecoNews: Array<{ id: string; image: string; headline: string; lead: string; source: string; }>;
  newPost: string;
  setNewPost: (text: string) => void;
  handleCreatePost: () => void;
}

const CommunityPosts: React.FC<CommunityPostsProps> = ({ posts, ecoNews, newPost, setNewPost, handleCreatePost }) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PostCard
          content={item.content}
          userName={item.userName}
          userHandle={item.userHandle}
          userIcon={item.userIcon}
        />
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <CreatePost
            newPost={newPost}
            setNewPost={setNewPost}
            handleCreatePost={handleCreatePost}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2"
          >
            {ecoNews.map((newsItem) => (
              <EcoNewsCard
                key={newsItem.id}
                image={newsItem.image}
                headline={newsItem.headline}
                lead={newsItem.lead}
                source={newsItem.source}
              />
            ))}
          </ScrollView>
        </>
      }
    />
  );
};

export default CommunityPosts;
