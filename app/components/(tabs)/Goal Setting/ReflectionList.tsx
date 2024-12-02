import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import ReflectionCard from './Reflection';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { editReflection, deleteReflection } from '@/app/utils/reflectionUtils';
import { Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import FilterDate from './FilterDate';
import { myTheme } from '@/constants/custom-theme';

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

  useEffect(() => {
    const user = auth().currentUser;

    if (!user) {
      console.error('No user is logged in');
      return;
    }

    const userUid = user.uid;

    const unsubscribeReflections = firestore()
      .collection('reflections')
      .where('uid', '==', userUid)
      .onSnapshot(
        snapshot => {
          if (snapshot && !snapshot.empty) {
            const fetchedReflections = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                content: data.content,
                date: data.date,
                uid: data.uid,
              } as Reflection;
            });

            // Sort reflections by date in descending order
            const sortedReflections = fetchedReflections.sort((a, b) => {
              if (a.date && b.date) {
                return b.date.toDate().getTime() - a.date.toDate().getTime();
              } else if (a.date) {
                return -1; // If b.date is null, a comes first
              } else if (b.date) {
                return 1; // If a.date is null, b comes first
              } else {
                return 0; // If both dates are null, they are equal
              }
            });

            setReflections(sortedReflections);
          } else {
            // console.warn('No reflections found for this user');
            setReflections([]);
          }
        },
        error => {
          console.error('Error fetching reflections:', error);
        }
      );

    return () => {
      unsubscribeReflections();
    };
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));
  
      const filtered = reflections.filter(reflection => {
        if (reflection && reflection.date) {
          // Ensure the `date` is not null and is a valid date
          const reflectionDate = reflection.date.toDate();
          return reflectionDate >= startOfDay && reflectionDate <= endOfDay;
        }
        return false; // Exclude reflections with null or undefined date
      });
  
      setFilteredReflections(filtered);
    } else {
      setFilteredReflections(reflections);
    }
  }, [startDate, endDate, reflections]);
  

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <StyledLayout style={{ position: 'relative' }}>
      <StyledLayout className='mx-3 mb-5' style={{borderWidth:1, borderColor: myTheme['color-basic-400']}}></StyledLayout>
      <StyledLayout className="flex-row justify-between" style={{ zIndex: 1 }}>
        <StyledText 
          category="s1" 
          className="m-2" 
          style={{ 
            fontFamily: 'Poppins-SemiBold',
            color: myTheme['color-success-700'],
            fontSize: 22 
          }}
        >
          Reflections 💭
        </StyledText>
        <FilterDate onDateChange={handleDateChange} />
      </StyledLayout>

      <FlatList
        data={filteredReflections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ReflectionCard
            id={item.id}
            content={item.content}
            date={item.date}
            uid={item.uid}
            onEdit={newContent => editReflection(item.id, newContent)}
            onDelete={() => deleteReflection(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        style={{ zIndex: 0 }}
      />
    </StyledLayout>
  );
};

export default ReflectionList;
