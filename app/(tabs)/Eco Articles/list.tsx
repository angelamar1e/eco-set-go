import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Card, Text, Layout } from '@ui-kitten/components';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { EcoAction } from '../../../types/EcoAction';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/app/components/(tabs)/Eco Articles/SearchBar';
import FilterButtons from '@/app/components/(tabs)/Eco Articles/FilterButtons';
import { styled } from 'nativewind';
import { myTheme } from "@/constants/custom-theme";
import { useLoadFonts } from '@/assets/fonts/loadFonts';

const StyledLayout = styled(Layout);
const StyledCard = styled(Card);
const StyledText = styled(Text);

const EcoActionsList = () => {
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([]);
  const [filter, setFilter] = useState<string>('ALL');

  const fetchEcoActions = async (category: string) => {
    try {
      let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = firestore().collection('eco_actions');

      // Apply category filter if it's not "ALL"
      if (category !== 'ALL') {
        query = query.where('category', '==', category);
      }

      const ecoActionsCollection = await query.get();
      const data = ecoActionsCollection.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        category: doc.data().category, // Ensure this field is included
      })) as EcoAction[];

      setEcoActions(data);
    } catch (error) {
      console.error("Error fetching eco actions: ", error);
    }
  };

  // Fetch eco actions whenever the filter changes
  useEffect(() => {
    fetchEcoActions(filter);
  }, [filter]);

  const renderItem = ({ item }: { item: EcoAction }) => (
    <StyledCard
      onPress={() => router.push(`/components/(tabs)/Eco Articles/${item.id}`)}
      className='m-2 h-[150px] bg-transparent justify-end'
    >
      <Text category='s1'>{item.title}</Text>
    </StyledCard>
  );

  const fontsLoaded = useLoadFonts(); 

  return (
    <StyledLayout className='flex-1'>
      <StyledLayout className="flex-1">
        <StyledLayout className='h-1/6 rounded-b-3xl justify-center items-center relative'
          style={{ backgroundColor: myTheme['color-success-700']}}
        >
          <StyledText className="text-white text-3xl" style={{ fontFamily: 'Poppins-SemiBold'}}>
            Eco Articles
          </StyledText>
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
          data={ecoActions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </StyledLayout>
    </StyledLayout>
  );
};

export default EcoActionsList;
