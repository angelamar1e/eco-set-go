import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import EcoNewsCard from './EcoNewsCard';
import firestore from "@react-native-firebase/firestore";

interface Post {
  id: string;
  content: string;
  userName: string;
  userHandle: string;
  userIcon: string;
}

interface EcoNewsItem {
  id: string;
  thumbnail: string;
  headline: string;
  date: string;
  link: string;
}

interface CommunityPostsProps {
  posts: Post[];
  newPost: string;
  setNewPost: (text: string) => void;
  handleCreatePost: () => void;
}

const CommunityPosts: React.FC<CommunityPostsProps> = ({ posts }) => {
  const [ecoNews, setEcoNews] = useState<EcoNewsItem[]>([]);

  useEffect(() => {
    const ecoNewsCollection = firestore().collection('econews');

    const unsubscribe = ecoNewsCollection.onSnapshot(snapshot => {
      const newsItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EcoNewsItem[];
      setEcoNews(newsItems);
    });

    return () => unsubscribe();
  }, []);

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
          <CreatePost />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2"
          >
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
