import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import ConvertButton from './ConvertButton';
import { myTheme } from '@/constants/custom-theme';

interface Incentive {
  id: string;
  title: string;
  content: string;
  points: number;
  icon: string;
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);

const Incentives = () => {
  const [incentives] = useState<Incentive[]>([
    { id: '3', icon:'📋', title: 'Register for free', content: 'OrgName fun run for a cause', points: 7000 },
    { id: '1', icon:'💰', title: '5% OFF', content: 'Any single item purchase from Brand', points: 3000 },
    { id: '2', icon:'🌱', title: 'Plant a Tree', content: 'Support OrgName environmental cause', points: 5000 },
  ]);

  const renderItem = ({ item }: { item: Incentive }) => (
    <StyledLayout className="flex-row mr-2 ml-2 mt-1 mb-1">
      <StyledCard
        className="flex-1 rounded-l-2xl border-r-0 items-center justify-center"
        style={{
          flex: 1, 
          elevation: 1,
          backgroundColor: myTheme['color-success-transparent-100'],
          borderColor: myTheme['color-success-900'],
          borderWidth: 1,
        }}
      >
        <StyledText className='text-center mb-2 text-xl'>{item.icon}</StyledText>
        <StyledText
          className="text-center text-2sm"
          style={{ fontFamily: 'Poppins-Medium'}}
        >
          {item.title}
        </StyledText>
      </StyledCard>
  
      <StyledCard
        className="flex-2 rounded-r-2xl"
        style={{
          flex: 2,
          elevation: 1,
          padding: 8, 
          borderWidth: 1,
          borderColor: myTheme['color-success-900'],
        }}
      >
        <StyledLayout className="flex-row items-center justify-between">
          <StyledLayout style={{ flex: 1, marginRight: 8 }}> 
            <StyledText
              category="p2"
              className="text-left"
              numberOfLines={2} 
            >
              {item.content}
            </StyledText>
            <StyledText
              category="s1"
              className="text-sm mt-1"
              style={{ color: myTheme['color-success-900'] }}
            >
              {item.points} EcoPoints
            </StyledText>
          </StyledLayout>
          <StyledLayout style={{ alignSelf: 'flex-start' }}> 
            <ConvertButton />
          </StyledLayout>
        </StyledLayout>
      </StyledCard>
    </StyledLayout>
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
