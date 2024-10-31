import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import PostCard from './PostCard';
import { CreatePost } from './CreatePost';
import EcoNewsCard from './EcoNewsCard';
import firestore, { Timestamp } from '@react-native-firebase/firestore';

interface Post {
  id: string;
  content: string;
  userName: string;
  timestamp: Timestamp;
}

interface EcoNewsItem {
  id: string;
  thumbnail: string;
  headline: string;
  date: string;
  link: string;
}

const CommunityPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ecoNews, setEcoNews] = useState<EcoNewsItem[]>([]);

  useEffect(() => {
    const unsubscribePosts = firestore()
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Post[];
        setPosts(fetchedPosts);
      });

    const unsubscribeEcoNews = firestore()
      .collection('econews')
      .onSnapshot(snapshot => {
        const newsItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as EcoNewsItem[];
        setEcoNews(newsItems);
      });

    return () => {
      unsubscribePosts();
      unsubscribeEcoNews();
    };
  }, []);

  // Function to handle editing a post
  const handleEditPost = (id: string, newContent: string) => {
    firestore()
      .collection('posts')
      .doc(id)
      .update({ content: newContent })
      .then(() => {
        console.log('Post updated successfully!');
      })
      .catch(error => {
        console.error('Error updating post: ', error);
      });
  };

  // Function to handle deleting a post
  const handleDeletePost = (id: string) => {
    firestore()
      .collection('posts')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Post deleted successfully!');
      })
      .catch(error => {
        console.error('Error deleting post: ', error);
      });
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PostCard
          id={item.id} // Pass the ID
          content={item.content}
          userName={item.userName}
          timestamp={item.timestamp} 
          onEdit={(newContent) => handleEditPost(item.id, newContent)} // Pass the edit handler
        />
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <CreatePost />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
            {ecoNews.map((newsItem) => (
              <EcoNewsCard
                key={newsItem.id}
                thumbnail={newsItem.thumbnail}
                headline={newsItem.headline}
                date={newsItem.date}
                link={newsItem.link}
              />
            ))}
          </ScrollView>
        </>
      }
    />
  );
};

export default CommunityPosts;
