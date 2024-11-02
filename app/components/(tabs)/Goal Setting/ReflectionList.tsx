import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView} from 'react-native';
import ReflectionCard from './Reflection';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { editReflection, deleteReflection } from '@/app/utils/reflectionUtils';
import { Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';

interface Reflection {
  id: string;
  content: string;
  date: Timestamp;
  uid: string;
}

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

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
    <StyledLayout>
      <StyledText className="m-2 font-bold" category='s1'>Reflection</StyledText>
      <FlatList
      data={reflections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ReflectionCard
          id={item.id}
          content={item.content}
          date={item.date}
          uid={item.uid}
          onEdit={(newContent) => editReflection(item.id, newContent)} 
          onDelete={() => deleteReflection(item.id)} 
        />
      )}
      showsVerticalScrollIndicator={false}
    />
    </StyledLayout>
    
  );
};

export default ReflectionList;
