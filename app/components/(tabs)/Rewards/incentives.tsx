import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Card, Text, Layout, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import ConvertButton from './ConvertButton';

interface Incentive {
  id: string;
  title: string;
  content: string;
  points: number;
}

const StyledLayout = styled(Layout);
const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledButton = styled(Button);

const Incentives = () => {
  // State to hold the dummy incentives data
  const [incentives] = useState<Incentive[]>([
    { id: '1', title: '5% OFF', content: 'Any single item purchase from Brand', points: 3000 },
    { id: '2', title: 'Plant a Tree', content: 'Support OrgName environmental cause', points: 5000 },
    { id: '3', title: 'Register for free', content: 'OrgName fun run for a cause', points: 7000 },
  ]);

  const renderItem = ({ item }: { item: Incentive }) => (
      <StyledCard className="flex-row mr-2 ml-2 mt-1 mb-1 rounded-lg justify-end">
          <StyledText category="s1" className="text-left">{item.title}</StyledText>
            <StyledText category="p2" className="text-">{item.content}</StyledText>

            <StyledLayout className="flex-row justify-end mt-2">
            
              <StyledButton
                size="small"
                status="basic"
                className="rounded-full m-1 p-1"
              >
                <StyledText category="label">{item.points} EcoPoints</StyledText>
              </StyledButton>

                <ConvertButton />
            
            </StyledLayout>
          
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
