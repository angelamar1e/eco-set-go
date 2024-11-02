import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text } from 'react-native';
import ReflectionCard from './Reflection';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { editReflection, deleteReflection } from '@/app/utils/reflectionUtils';

interface Reflection {
  id: string;
  content: string;
  date: string; // Assuming this is stored as a string
  uid: string;
  timestamp: Timestamp; // Ensure timestamp is included
}

const ReflectionList: React.FC = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);

  useEffect(() => {
    const unsubscribeReflections = firestore()
      .collection('reflections')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const fetchedReflections = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Reflection[];
        setReflections(fetchedReflections);
      });

    return () => {
      unsubscribeReflections();
    };
  }, []);

  return (
    <FlatList
      data={reflections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ReflectionCard
          id={item.id}
          content={item.content}
          timestamp={item.timestamp}
          uid={item.uid}
          onEdit={(newContent) => editReflection(item.id, newContent)} // Edit handler
          onDelete={() => deleteReflection(item.id)} // Delete handler
        />
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <ScrollView>
          <Text>Your Reflections</Text>
        </ScrollView>
      }
    />
  );
};

export default ReflectionList;
