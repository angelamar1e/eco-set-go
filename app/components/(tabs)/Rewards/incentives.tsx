import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Card, Text, Layout } from '@ui-kitten/components';
import { styled } from 'nativewind';
import ConvertButton from './ConvertButton';
import { myTheme } from '@/constants/custom-theme';

interface Incentive {
  id: string;
  title: string;
  content: string;
  points: number;
}

const StyledCard = styled(Card);
const StyledText = styled(Text);

const Incentives = () => {
  const [incentives] = useState<Incentive[]>([
    { id: '1', title: '5% OFF', content: 'Any single item purchase from Brand', points: 3000 },
    { id: '2', title: 'Plant a Tree', content: 'Support OrgName environmental cause', points: 5000 },
    { id: '3', title: 'Register for free', content: 'OrgName fun run for a cause', points: 7000 },
  ]);

  const renderItem = ({ item }: { item: Incentive }) => (
    <StyledCard className="flex-col mr-4 ml-4 mt-1 mb-1 p-2 rounded-lg" style={{elevation: 1}} >
      <View className="flex-row">
        <View className="flex-1">
          <StyledText category="h6" className="text-left" style={{color: myTheme['color-info-500']}}>{item.title}</StyledText>
          <StyledText category="p2" className="text-left mt-1">{item.content}</StyledText>
          <StyledText category="label" className="text-sm mt-1"
            style={{ color: myTheme['color-primary-900'] }}
          >
            {item.points} EcoPoints
          </StyledText>
        </View>
        <ConvertButton />
      </View>
    </StyledCard>
  );
  
  return (
    <FlatList
      data={incentives}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default Incentives;
