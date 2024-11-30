import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Text } from '@ui-kitten/components';
import PostCard from './PostCard';
import { CreatePost } from './CreatePost';
import EcoNewsCard from './EcoNewsCard';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { handleEditPost, handleDeletePost } from '@/app/utils/communityUtils';

const StyledText = styled(Text);

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

interface Comment {
  id: string;
  postId: string;
  userName: string;
  timestamp: Timestamp;
  content: string;
}

const CommunityPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ecoNews, setEcoNews] = useState<EcoNewsItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

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

    const unsubscribeComments = firestore()
      .collection('comments')
      .onSnapshot(snapshot => {
        const fetchedComments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Comment[];
        setComments(fetchedComments);
      });

    return () => {
      unsubscribePosts();
      unsubscribeEcoNews();
      unsubscribeComments();
    };
  }, []);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PostCard
          id={item.id}
          content={item.content}
          userName={item.userName}
          timestamp={item.timestamp}
          onEdit={(newContent) => handleEditPost(item.id, newContent)}
          onDelete={() => handleDeletePost(item.id)}
          comments={comments.filter(comment => comment.postId === item.id)} // Filter comments by postId
        />
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          <CreatePost />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
            {ecoNews.length > 0 ? (
              ecoNews.map((newsItem) => (
                <EcoNewsCard
                  key={newsItem.id}
                  thumbnail={newsItem.thumbnail}
                  headline={newsItem.headline}
                  date={newsItem.date}
                  link={newsItem.link}
                />
              ))
            ) : (
              <StyledText 
                style={{ 
                  fontFamily: 'Poppins-Regular',
                  fontSize: 14,
                  textAlign: 'center',
                  padding: 16
                }}
              >
                No eco news available.
              </StyledText>
            )}
          </ScrollView>
        </>
      }
    />
  );
};

export default CommunityPosts;
