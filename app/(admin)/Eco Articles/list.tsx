import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Card, IconButton, Button } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { router, Stack } from 'expo-router';
import { EcoAction } from '../../../types/EcoAction';
import { getEcoActionsList } from '@/app/utils/articles_utils';
import LogOutButton from '@/app/components/LogOutButton';
import firestore from '@react-native-firebase/firestore';

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

  const handleDelete = (id: string) => {
    // Add delete logic here (e.g., Firestore delete operation)
  };

  const handleEdit = (id: string) => {
    // router.push(`components/(tabs)/Eco Articles/${id}/edit`);
  };

  const renderItem = ({ item }: { item: EcoAction }) => (
    <Swipeable
      renderRightActions={() => (
        <>
          <IconButton icon="pencil" onPress={() => handleEdit(item.id)} />
          <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
        </>
      )}
    >
      <Card
        style={{ margin: 10 }}
      >
        <Card.Content>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
        </Card.Content>
      </Card>
    </Swipeable>
  );

  return (
    <>
    <Stack>
      <Stack.Screen name="Eco Articles/list" options={{ headerShown: false }} />
    </Stack>
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <Text style={{ textAlign: 'center', fontSize: 24, margin: 20 }}>Eco Actions</Text>
      <FlatList
        data={ecoActions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Button
        icon="plus"
        mode="contained"
        onPress={() => router.push('components/(admin)/Eco Articles/add_article')}
        style={{ position: "absolute", bottom: 40, right: 20, borderRadius: 50 }}
      >
        Add
      </Button>
    </View>
    </>
  );
};

export default EcoActionsList;
