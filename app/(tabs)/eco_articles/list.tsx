import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { EcoAction } from '../../../types/EcoAction';

const EcoActionsList = () => {
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([]);
const id = ''

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('eco_actions')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        })) as EcoAction[];

        setEcoActions(data);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }: { item: EcoAction }) => (
    <Card
      onPress={() => router.push('/2')}
      style={{ margin: 10 }}
    >
      <Card.Content>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <Text style={{ textAlign: 'center', fontSize: 24, margin: 10 }}>Eco Actions</Text>
      <FlatList
        data={ecoActions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default EcoActionsList;
