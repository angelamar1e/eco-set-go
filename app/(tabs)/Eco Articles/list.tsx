import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { router, Stack } from 'expo-router';
import { EcoAction } from '../../../types/EcoAction';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const EcoActionsList = () => {
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchEcoActions = async () => {
      const ecoActionsCollection = await firestore().collection('eco_actions').get();
      const data = ecoActionsCollection.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        category: doc.data().category // Assume category field exists in Firestore
      })) as EcoAction[];

      // Extract unique categories from the fetched data
      const uniqueCategories = [...new Set(data.map((item) => item.category))];
      setCategories(uniqueCategories);
      setEcoActions(data);
    };

    fetchEcoActions();
  }, []);

  // Filter eco actions based on the selected category
  const filteredEcoActions = selectedCategory
    ? ecoActions.filter((action) => action.category === selectedCategory)
    : ecoActions;

  const renderItem = ({ item }: { item: EcoAction }) => (
    <Card
      onPress={() => router.push(`components/(tabs)/Eco Articles/${item.id}`)}
      className='m-2 h-[150px] bg-white:transparent justify-end'
    >
      <Card.Content className='mb-2'>
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
          <View className='bg-lime-800 h-1/6 rounded-b-3xl mb-4 justify-center items-center'>
            <ThemedText type='subtitle' className='text-[28px] text-gray-100'>Eco Actions</ThemedText>
          </View>

          {/* Category Chips */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                onPress={() => setSelectedCategory(category === selectedCategory ? null : category)} // Toggle category selection
                selected={category === selectedCategory}
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                {category}
              </Chip>
            ))}
          </View>

          <FlatList
            data={filteredEcoActions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </SafeAreaView></>
    </ThemedView>
  );
};

export default EcoActionsList;
