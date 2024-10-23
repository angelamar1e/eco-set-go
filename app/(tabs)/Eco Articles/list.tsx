import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Card, Text, Layout } from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import { router, Stack } from 'expo-router';
import { EcoAction } from '../../../types/EcoAction';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/app/components/(tabs)/Eco Articles/SearchBar';
import FilterButtons from '@/app/components/(tabs)/Eco Articles/FilterButtons';
import { styled } from 'nativewind';

const StyledLayout = styled(Layout);
const StyledCard = styled(Card);
const StyledText = styled(Text);

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
    <StyledCard
      onPress={() => router.push(`/components/(tabs)/Eco Articles/ArticlePage/${item.id}`)}
      className='m-2 h-[150px] bg-transparent justify-end'
    >
      <Text category='s1'>{item.title}</Text>
    </StyledCard>
  );

  return (
    <StyledLayout className='flex-1 px-2'>
      <Stack>
        <Stack.Screen name="Eco Articles/list" options={{ headerShown: false }} />
      </Stack>
      <SafeAreaView className='flex-1 mt-3'>
        <StyledLayout className='flex-1'>
          <StyledLayout className='bg-[#4A8B2A] h-1/6 rounded-b-3xl mb-4 justify-center items-center'>
            <StyledText category='h4' className='text-white'>Eco Actions</StyledText>
          </StyledLayout>

          <StyledLayout className="ml-2 mr-2">
            <SearchBar onSearch={(query: string) => console.log('Searching for:', query)} />
          </StyledLayout>

          <StyledLayout className="ml-2 mt-4 mr-2">
            <FilterButtons 
              selectedFilter={filter} 
              onFilterChange={setFilter} 
            />
          </StyledLayout>

          <FlatList
            className="mt-2"
            data={filteredActions} 
            renderItem={renderItem}
            keyExtractor={(item) => item.id} 
          />
        </StyledLayout>
      </SafeAreaView>
    </StyledLayout>
  );
};

export default EcoActionsList;
