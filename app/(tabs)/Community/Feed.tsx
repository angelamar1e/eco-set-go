import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import PostCard from '@/app/components/(tabs)/Community/PostCard';

export type RootStackParamList = {
    Home: undefined;
    CreatePost: undefined;
  };
  
const Stack = createNativeStackNavigator<RootStackParamList>();
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface Post {
  id: string;
  content: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([
    { id: '1', content: 'Hello World!' },
    { id: '2', content: 'This is a second post!' },
  ]);

  return (
    <View className="flex-1 bg-white p-4">
      <TouchableOpacity
        className="bg-blue-500 p-2 rounded-lg mb-4"
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text className="text-white text-center">Create New Post</Text>
      </TouchableOpacity>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard content={item.content} />}
      />
    </View>
  );
};

export default HomeScreen;
