import React, { useEffect, useState } from 'react';
import { styled } from 'nativewind';
import { Layout, Text } from '@ui-kitten/components';
import { fetchReflections } from '@/app/utils/reflectionUtils';
import ReflectionCard from './Reflection';

const StyledLayout = styled(Layout);

const ReflectionList = () => {
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReflections = async () => {
    setLoading(true);
    try {
      const fetchedReflections = await fetchReflections(); // Fetch all reflections
      setReflections(fetchedReflections);
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReflections(); // Load reflections on mount
  }, []);

  if (loading) {
    return (
      <StyledLayout className="flex-1 justify-center items-center">
        <Text category="h5">Loading reflections...</Text>
      </StyledLayout>
    );
  }

  return (
    <StyledLayout className="flex-1">
      {reflections.length === 0 ? (
        <Text category="h6" className="text-center">
          No reflections found.
        </Text>
      ) : (
        reflections.map(reflection => (
          <ReflectionCard 
            key={reflection.id} 
            id={reflection.id} 
            content={reflection.content} 
            timestamp={reflection.date} // Adjust if needed
          />
        ))
      )}
    </StyledLayout>
  );
};

export default ReflectionList;
