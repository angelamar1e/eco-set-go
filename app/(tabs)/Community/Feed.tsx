// src/app/components/(tabs)/Community/Feed.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import SearchAndButtons from '@/app/components/(tabs)/Community/SearchAndButtons';
import AllPosts from '@/app/components/(tabs)/Community/AllPosts';

const Feed: React.FC = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    { id: '1', content: 'Hello World!', userName: 'John Doe', userHandle: 'john_doe', userIcon: 'https://example.com/icon1.png' },
    { id: '2', content: 'This is a second post!', userName: 'Jane Smith', userHandle: 'jane_smith', userIcon: 'https://example.com/icon2.png' },
    { id: '3', content: 'Sample!', userName: 'Jane Smith', userHandle: 'jane_smith', userIcon: 'https://example.com/icon2.png' },
  ]);
  const [newPost, setNewPost] = useState('');
  const [isListVisible, setIsListVisible] = useState(true); 

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const newPostData = {
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

  return (
    <View className="flex-1">
      <View className="bg-lime-800 h-1/4 rounded-b-3xl justify-center items-center relative">
        <ThemedText type='subtitle' className='text-[28px] text-gray-100 mb-2'>Community</ThemedText>
        <ThemedText type='default' className='text-[15px] text-gray-100'>Date</ThemedText> 

        <SearchAndButtons 
          onSearch={(query) => console.log('Searching for:', query)}
          isListVisible={isListVisible}
          setIsListVisible={setIsListVisible}
        />
      </View>

      {isListVisible && (
        <AllPosts
          posts={posts}
          newPost={newPost}
          setNewPost={setNewPost}
          handleCreatePost={handleCreatePost}
        />
      )}
    </View>
  );
};

export default Feed;
