import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { EcoAction } from '../../../types/EcoAction';
import { getEcoActionsList } from '@/app/utils/articles_utils';
import { SafeAreaView } from 'react-native-safe-area-context';

const EcoActionsList = () => {
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([]);

  useEffect(() => {
    const fetchEcoActions = async () => {
      const data = await getEcoActionsList();
      setEcoActions(data);
    }

    fetchEcoActions();
    
  }, []);

  const renderItem = ({ item }: { item: EcoAction }) => (
    <Card
      onPress={() => router.push(`components/(tabs)/Eco Articles/${item.id}`)}
      style={{ margin: 10 }}
    >
      <Card.Content>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView className='flex-1'>
      <View style={{ flex: 1}}>
        <Text style={{ textAlign: 'center', fontSize: 24, margin: 10 }}>Eco Actions</Text>
        <FlatList
          data={ecoActions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
    );
};

export default EcoActionsList;
