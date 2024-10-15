import React from 'react';
import { View, FlatList } from 'react-native';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

interface AllPostsProps {
  posts: Array<{ id: string; content: string; userName: string; userHandle: string; userIcon: string; }>;
  newPost: string;
  setNewPost: (text: string) => void;
  handleCreatePost: () => void;
}

const AllPosts: React.FC<AllPostsProps> = ({ posts, newPost, setNewPost, handleCreatePost }) => {
  return (
    <View className="flex-1">
      <CreatePost 
        newPost={newPost}
        setNewPost={setNewPost}
        handleCreatePost={handleCreatePost}
      />
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
        style={{ flexGrow: 1 }}
      />
    </View>
  );
};

export default AllPosts;
