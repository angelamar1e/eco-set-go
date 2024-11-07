import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Swipeable } from 'react-native-gesture-handler';
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

  // Function to render right swipe action
  const renderRightActions = () => (
    <StyledLayout className="justify-center items-center w-11/12" style={{ backgroundColor: myTheme['color-success-100'] }}>
      <ConvertButton />
    </StyledLayout>
  );

  const renderItem = ({ item }: { item: Incentive }) => (
    <StyledLayout className="flex-row mr-2 ml-2 mt-1 mb-1 ">
      {/* Wrap the first StyledCard in a Swipeable */}
        <StyledLayout className='w-1/3'>
      <Swipeable renderLeftActions={renderRightActions}>
        <StyledCard
          className="rounded items-center justify-center"
          style={{
            backgroundColor: myTheme['color-success-100'],
            borderColor: myTheme['color-success-transparent-100'],
          }}
        >
          <StyledText className='text-center mb-2 text-xl'>{item.icon}</StyledText>
          <StyledText
            className="text-center text-sm"
            style={{ fontFamily: 'Poppins-Medium'}}
          >
            {item.title}
          </StyledText>
        </StyledCard>
      </Swipeable>
        </StyledLayout>

      {/* Second card with the item details */}
      <StyledCard
      className='w-2/3 rounded'
        style={{
          elevation: 1/2,
          padding: 2,
          borderWidth: 1,
          borderColor: myTheme['color-success-900'],
        }}
      >
        <StyledLayout className="flex-row items-center justify-between">
          <StyledLayout>
            <StyledText className="text-left text-xs" numberOfLines={2}>
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
