import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Card, Text, Layout } from '@ui-kitten/components';
import { styled } from 'nativewind';

interface Reflection {
  id: string;
  title: string;
  content: string;
}

const ReflectionsList = () => {
  const [reflections] = useState<Reflection[]>([
    { id: '1', title: 'August 7, 2024', content: 'Today, I learned about the importance of reducing plastic waste and its impact on the environment.' },
    { id: '2', title: 'August 8, 2024', content: 'I started using reusable bags and refused single-use plastic bags at the store.' },
  ]);

  const StyledCard = styled(Card);
  const StyledText = styled(Text);
  const StyledLayout = styled(Layout);

  const renderItem = ({ item }: { item: Reflection }) => (
    <StyledLayout className="m-1 p-1 rounded-lg">
      <StyledCard>
        <StyledText category="h6">{item.title}</StyledText>
        <StyledText category="p2">{item.content}</StyledText>
      </StyledCard>
    </StyledLayout>
  );

  return (
    <Layout>
      <FlatList
        data={reflections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Layout>
  );
};

export default ReflectionsList;
