import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import ReflectionCard from './Reflection';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { editReflection, deleteReflection } from '@/app/utils/reflectionUtils';
import { Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import FilterDate from './FilterDate';

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
  const [filteredReflections, setFilteredReflections] = useState<Reflection[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filterActive, setFilterActive] = useState(false);

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

  useEffect(() => {
    applyDateFilter(reflections); // Pass reflections as argument
  }, [startDate, endDate, filterActive, reflections]);  

  const applyDateFilter = (fetchedReflections: Reflection[]) => {
    if (filterActive && startDate && endDate) {
      const filtered = fetchedReflections.filter(reflection => {
        // Ensure reflection.date is defined and has a toDate method (Timestamp object)
        if (reflection.date && typeof reflection.date.toDate === 'function') {
          const reflectionDate = reflection.date.toDate();
          return reflectionDate >= startDate && reflectionDate <= endDate;
        }
        return false; // Skip if reflection.date is undefined or not a Timestamp
      });
      setFilteredReflections(filtered);
    } else {
      setFilteredReflections(fetchedReflections); // Show all if not filtering
    }
  };
  

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleToggleFilter = (isClicked: boolean) => {
    setFilterActive(isClicked);
    if (!isClicked) {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <StyledLayout>
      <StyledLayout className='flex-row justify-between'>
        <StyledText className="m-2 font-bold" category='s1'>Reflection</StyledText>
        <FilterDate onToggle={handleToggleFilter} onDateChange={handleDateChange} />
      </StyledLayout>
      
      <FlatList
        data={filteredReflections}
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
