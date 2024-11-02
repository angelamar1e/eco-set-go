import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text } from 'react-native';
import ReflectionCard from './Reflection';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { editReflection, deleteReflection } from '@/app/utils/reflectionUtils';

interface Reflection {
  id: string;
  content: string;
  date: Timestamp; // Assuming this is stored as a string
  uid: string;
}

const ReflectionList: React.FC = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);

  useEffect(() => {
    const unsubscribeReflections = firestore()
      .collection('reflections')
      .orderBy('date', 'desc')
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
          date={item.date}
          uid={item.uid}
          onEdit={(newContent) => editReflection(item.id, newContent)} // Edit handler
          onDelete={() => deleteReflection(item.id)} // Delete handler
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ReflectionList;
