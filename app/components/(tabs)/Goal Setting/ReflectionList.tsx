import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';

// Define the Reflection interface (adjust according to your Firestore structure)
interface Reflection {
  id: string;
  title: string;
  content: string;
}

const ReflectionsList = () => {
  // State to hold the dummy reflections data
  const [reflections] = useState<Reflection[]>([
    { id: '1', title: 'August 7, 2024', content: 'Today, I learned about the importance of reducing plastic waste and its impact on the environment.' },
    { id: '2', title: 'August 8, 2024', content: 'I started using reusable bags and refused single-use plastic bags at the store.' },
  ]);

  const renderItem = ({ item }: { item: Reflection }) => (
    <Card className='mb-2 bg-stone-100 w-[343px]'>
      <Card.Content className='items-left'>
        <ThemedText type='default' className='text-lg text-black'>{item.title}</ThemedText>
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
