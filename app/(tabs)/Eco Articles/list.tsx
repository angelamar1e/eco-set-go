import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { router, Stack } from 'expo-router';
import { EcoAction } from '../../../types/EcoAction';
import { getEcoActionsList } from '@/app/utils/articles_utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const EcoActionsList = () => {
  
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([]);

  useEffect(() => {
    const fetchEcoActions = async () => {
      const ecoActionsCollection = await firestore().collection('eco_actions').get();

      const data = ecoActionsCollection.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
          })) as EcoAction[];

      setEcoActions(data);
    }

    fetchEcoActions();
  });

  const renderItem = ({ item }: { item: EcoAction }) => (
    <Card
      onPress={() => router.push(`components/(tabs)/Eco Articles/${item.id}`)}
      className='m-1 ml-6 w-[350px] h-[150px] bg-white:transparent justify-end'
    >
      <Card.Content className='mb-2 ml-2'>
        <ThemedText type='default' className='text-[20px] text-lime-800 italic'>{item.title}</ThemedText>
      </Card.Content>
    </Card>
  );

  return (
    <ThemedView className='flex-1 px-2'>
    <><Stack>
      <Stack.Screen name="Eco Articles/list" options={{ headerShown: false }} />
    </Stack>
    <SafeAreaView className='flex-1 mt-3'>
        <View className='flex-1'>
          <View className='bg-lime-800 h-1/4 rounded-b-3xl mb-4 justify-center items-center'>
            <ThemedText type='subtitle' className='text-[28px] text-stone-300'>Eco Actions</ThemedText>
          </View>
          <FlatList
            data={ecoActions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id} />
        </View>
      </SafeAreaView></>
      </ThemedView>
    );
};

export default EcoActionsList;
