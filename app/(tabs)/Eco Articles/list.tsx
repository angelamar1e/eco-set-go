import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { router, Stack } from 'expo-router';
import { EcoAction } from '../../../types/EcoAction';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SearchBar from '@/app/components/(tabs)/Eco Articles/SearchBar';
import FilterButtons from '@/app/components/(tabs)/Eco Articles/FilterButtons';

const EcoActionsList = () => {
  
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([]);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchEcoActions = async () => {
      const ecoActionsCollection = await firestore().collection('eco_actions').get();
      const data = ecoActionsCollection.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
      })) as EcoAction[];

      setEcoActions(data);
    };

    fetchEcoActions();
  }, []);

  // Filter actions based on selected category
  const filteredActions = ecoActions.filter((item) => {
    if (filter === 'ALL') return true;
    return item.title.toLowerCase().includes(filter.toLowerCase());
  });

  const renderItem = ({ item }: { item: EcoAction }) => (
    <Card
      onPress={() => router.push(`components/(tabs)/Eco Articles/${item.id}`)}
      className='m-2 h-[150px] bg-white:transparent justify-end'
    >
      <Card.Content className='mb-2'>
        <ThemedText type='subtitle' className='text-[18px] text-lime-800 italic'>{item.title}</ThemedText>
      </Card.Content>
    </Card>
  );

  return (
    <ThemedView className='flex-1 px-2'>
      <Stack>
        <Stack.Screen name="Eco Articles/list" options={{ headerShown: false }} />
      </Stack>
      <SafeAreaView className='flex-1 mt-3'>
        <View className='flex-1'>
          <View className='bg-lime-800 h-1/6 rounded-b-3xl mb-4 justify-center items-center'>
            <ThemedText type='subtitle' className='text-[28px] text-gray-100'>Eco Actions</ThemedText>
          </View>

          <View className="ml-2 mr-2">
          <SearchBar onSearch={(query: string) => console.log('Searching for:', query)} />
          </View>

          <View className="ml-2 mr-2">
          <FilterButtons 
              selectedFilter={filter} 
              onFilterChange={setFilter} 
            />
          </View>

          <FlatList
            className="mt-2"
            data={filteredActions} 
            renderItem={renderItem}
            keyExtractor={(item) => item.id} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};

export default EcoActionsList;
