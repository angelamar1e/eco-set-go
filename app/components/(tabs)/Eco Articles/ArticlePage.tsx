import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';

const ArticlePage = () => {
  const navigation = useNavigation();

  return (
    <ThemedView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-lg font-semibold">Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-4">🍱 Food</Text>
      </View>

      <View className="bg-green-600 mx-4 my-2 p-3 rounded-lg flex-row items-center justify-between">
        <Text className="text-white text-lg font-bold">Title</Text>
        <TouchableOpacity>
          <FontAwesome name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View className="mx-4 mt-2 flex-row space-x-3">
        <View className="flex-1 bg-white p-3 rounded-lg shadow-sm">
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your image source
            className="w-full h-40 rounded-lg"
          />
          <View className="mt-3">
            <Text className="text-lg font-bold">Instructions</Text>
            <Text className="text-gray-600 mt-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </Text>
          </View>
        </View>

        <View className="flex-1 space-y-3">
          <View className="bg-white p-3 rounded-lg shadow-sm">
            <Text className="text-lg font-bold">Facts</Text>
            <Text className="text-gray-600 mt-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </Text>
          </View>

          <View className="bg-white p-3 rounded-lg shadow-sm">
            <Text className="text-lg font-bold">Benefits</Text>
            <Text className="text-gray-600 mt-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </Text>
          </View>
        </View>
      </View>

      <View className="mx-4 mt-4 p-3 bg-white rounded-lg shadow-sm flex-row items-center">
        <TextInput
          placeholder="Write a comment..."
          className="flex-1 bg-gray-100 p-3 rounded-lg text-gray-800"
        />
      </View>

      <TouchableOpacity className="mx-4 mt-2 p-3 bg-green-600 rounded-lg">
        <Text className="text-center text-white font-semibold">Comment</Text>
      </TouchableOpacity>
      </ThemedView>
  );
};

export default ArticlePage;