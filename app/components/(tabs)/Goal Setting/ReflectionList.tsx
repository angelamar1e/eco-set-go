import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, Layout, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

interface Reflection {
  id: string;
  title: string;
  content: string;
}

const ReflectionsList = () => {
  const [reflections, setReflections] = useState<Reflection[]>([
    { id: '1', title: 'August 7, 2024', content: 'Today, I learned about the importance of reducing plastic waste and its impact on the environment.' },
    { id: '2', title: 'August 8, 2024', content: 'I started using reusable bags and refused single-use plastic bags at the store.' },
  ]);

  const StyledCard = styled(Card);
  const StyledText = styled(Text);
  const StyledLayout = styled(Layout);

  const handleDelete = (id: string) => {
    setReflections((prevReflections) => 
      prevReflections.filter((reflection) => reflection.id !== id)
    );
  };

  const renderItem = ({ item }: { item: Reflection }) => (
    <Swipeable
      renderRightActions={() => (
        <View className="flex items-center justify-center ml-2">
          <Button
            appearance="outline"
            status="danger"
            onPress={() => handleDelete(item.id)}
            accessoryLeft={() => <Ionicons name="trash" size={15} />}
          >
            Delete
          </Button>
        </View>
      )}
    >
      <StyledLayout className="m-1 p-1 rounded-lg">
        <StyledCard>
          <StyledText category="h6">{item.title}</StyledText>
          <StyledText category="p2">{item.content}</StyledText>
        </StyledCard>
      </StyledLayout>
    </Swipeable>
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
