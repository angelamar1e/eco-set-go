import React, { useEffect, useState } from 'react';
import { FlatList, Image } from 'react-native';
import { Card, Text, Layout } from '@ui-kitten/components';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { EcoAction } from '../../../types/EcoAction';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/app/components/(tabs)/Eco Articles/SearchBar';
import FilterButtons from '@/app/components/(tabs)/Eco Articles/FilterButtons';
import { styled } from 'nativewind';
import { myTheme } from "@/constants/custom-theme";
import storage from '@react-native-firebase/storage';
import { useLoadFonts } from '@/assets/fonts/loadFonts';
import { ActivityIndicator } from 'react-native-paper';

const StyledLayout = styled(Layout);
const StyledCard = styled(Card);
const StyledText = styled(Text);

const cache: { [key: string]: string } = {}; // In-memory cache for image URLs

const EcoActionsList = () => {
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchEcoActions = async (category: string) => {
    try {
      setLoading(true);
      let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = firestore().collection('eco_actions');

      if (category !== 'ALL') {
        query = query.where('category', '==', category);
      }

      const ecoActionsCollection = await query.get();
      const data = await Promise.all(
        ecoActionsCollection.docs.map(async (doc) => {
          const ecoActionData = doc.data();
          let imageUrl = ecoActionData.image ? await loadImage(ecoActionData.image) : null;
          
          return {
            id: doc.id,
            title: ecoActionData.title,
            category: ecoActionData.category,
            image: imageUrl,
          };
        })
      );

      setEcoActions(data as EcoAction[]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching eco actions: ", error);
    }
  };

  const loadImage = async (gsUrl: string) => {
    if (cache[gsUrl]) return cache[gsUrl];

    try {
      const ref = storage().refFromURL(gsUrl);
      const url = await ref.getDownloadURL();
      cache[gsUrl] = url;
      return url;
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchEcoActions(filter);
  }, [filter]);

  const renderItem = ({ item }: { item: EcoAction }) => {
    return (
      <StyledCard
        onPress={() => router.push(`/components/(tabs)/Eco Articles/${item.id}`)}
        className="h-[150px] rounded-xl m-2"
        style={{
          borderColor: myTheme['color-success-700'],
          borderWidth: 1,
          borderBottomWidth: 1,
          overflow: 'hidden',
        }}
      >
        {item.image && (
          <Image
            source={{ uri: item.image }}
            className='rounded-lg'
            style={{
              zIndex:10,
              opacity: 0.5,
              width: '150%', 
              height: '170%',
            }}
            resizeMode="cover"
          />
        )}
        {/* Title section positioned at the bottom */}
        <StyledLayout
          className="justify-center items-center p-2"
          style={{
            zIndex: 20,
            backgroundColor: myTheme['color-success-700'],
            position: 'absolute',
            top: 0,
            height: 70,
            width: '115%',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontFamily: 'Poppins-Regular',
            }}
          >
            {item.title}
          </Text>
        </StyledLayout>
      </StyledCard>
    );
  };

  const fontsLoaded = useLoadFonts(); 

  return (
    <StyledLayout className='flex-1 pb-12'>
      <StyledLayout className="flex-1">
        <StyledLayout className='h-1/6 rounded-b-3xl justify-center items-center relative'
          style={{ backgroundColor: myTheme['color-success-700']}}
        >
          <StyledText className="text-white text-2xl" style={{ fontFamily: 'Poppins-SemiBold',}}>
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
        {(loading === true) ? (
          <StyledLayout className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={myTheme['color-success-600']} />
        </StyledLayout>
        ) : (
          <FlatList
            className="mt-2"
            data={ecoActions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </StyledLayout>
    </StyledLayout>
  );
};

export default EcoActionsList;