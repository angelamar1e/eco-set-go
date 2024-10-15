import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import PostCard from '@/app/components/(tabs)/Community/PostCard';

export type RootStackParamList = {
    Feed: undefined;
    CreatePost: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
type FeedProps = NativeStackScreenProps<RootStackParamList, 'Feed'>;

interface Post {
  id: string; // Added id to the Post interface
  content: string;
  userName: string;
  userHandle: string; // Username or handle
  userIcon: string; // URL or local path to the user icon image
}

const Feed: React.FC<FeedProps> = ({ navigation }) => {
    const [posts, setPosts] = useState<Post[]>([
        { id: '1', content: 'Hello World!', userName: 'John Doe', userHandle: 'john_doe', userIcon: 'https://example.com/icon1.png' },
        { id: '2', content: 'This is a second post!', userName: 'Jane Smith', userHandle: 'jane_smith', userIcon: 'https://example.com/icon2.png' },
        { id: '3', content: 'Third post content.', userName: 'Alice Johnson', userHandle: 'alice_j', userIcon: 'https://example.com/icon3.png' },
    ]);

    return (
        <View className='flex-1'>
            <View className='bg-lime-800 h-1/3 rounded-b-3xl mb-4 justify-center items-center relative'>
                <Text className='text-[28px] text-gray-100 mb-2'>Community</Text>
                <Text className='text-[15px] text-gray-100'>Date</Text>  
            </View>

            <View className="flex-1 bg-white p-4">
                <TouchableOpacity
                    className="bg-blue-500 p-2 rounded-lg mb-4"
                    onPress={() => navigation.navigate('CreatePost')}>
                    <Text className="text-white text-center">Create New Post</Text>
                </TouchableOpacity>

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
                    // Adding this to ensure proper scrolling
                    showsVerticalScrollIndicator={false} // Optional: to hide the vertical scroll indicator
                    style={{ flexGrow: 1 }} // Ensures the FlatList takes the available space
                />
            </View>
        </View>
    );
};

export default Feed;
