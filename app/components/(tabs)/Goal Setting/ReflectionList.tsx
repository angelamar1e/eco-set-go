import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';

// Define the Reflection interface (adjust according to your Firestore structure)
interface Reflection {
  id: string;
  title: string;
  content: string;
  date: string;
}

const ReflectionsList = () => {
  // State to hold the dummy reflections data
  const [reflections] = useState<Reflection[]>([
    { id: '1', title: 'August 7, 2024', content: 'Today, I learned about the importance of reducing plastic waste and its impact on the environment.', date: 'date' },
    { id: '2', title: 'August 8, 2024', content: 'I started using reusable bags and refused single-use plastic bags at the store.', date: 'date'},
  ]);

  const renderItem = ({ item }: { item: Reflection }) => (
    <Card className='mb-2 bg-stone-100 shadow-md rounded-lg w-[315px]'>
      <Card.Content>
        <ThemedText type='default' className='text-lg text-black font-semibold'>{item.title}</ThemedText>
        <ThemedText type='default' className='text-gray-700 mt-1'>{item.content}</ThemedText>
        <View className='h-[1px] bg-gray-300 my-2'></View>
        <ThemedText type='default' className='text-gray-300 mt-1'>{item.date}</ThemedText>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={reflections}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ReflectionsList;
