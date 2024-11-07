import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Swipeable } from 'react-native-gesture-handler';
import ConvertButton from './ConvertButton';
import { myTheme } from '@/constants/custom-theme';
import { Rewards } from '@/constants/Points';
import Index from '../../../index';

interface Incentive {
  title: string;
  content: string;
  points: number;
  terms: string[];
  icon: string;
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);

const Incentives = () => {
  
  const renderItem = ({ item, index }: { item: Incentive, index: number }) => {
    // Function to render right swipe action, now inside renderItem so `item` is available
    const renderLeftActions = () => (
      <StyledLayout className="justify-center items-center w-11/12 h-full" style={{ backgroundColor: myTheme['color-success-100'] }}>
        <ConvertButton reqPoints={item.points} rewardId={index}/>
      </StyledLayout>
    );

    return (
      <StyledLayout className="flex-row mr-2 ml-2 mt-1 mb-1 h-32">
        <StyledLayout className='w-1/3 h-full'>
          <Swipeable renderLeftActions={renderLeftActions}>
            <StyledCard
              className="rounded items-center h-full justify-center"
              style={{
                backgroundColor: myTheme['color-success-100'],
              }}
            >
              <StyledText className='text-center mb-2 text-xl'>{item.icon}</StyledText>
              <StyledText
                className="text-center text-m font-bold"
                style={{ fontFamily: 'Poppins-Medium'}}
              >
                {item.title}
              </StyledText>
            </StyledCard>
          </Swipeable>
        </StyledLayout>

        <StyledCard
          className='w-2/3 rounded'
          style={{
            elevation: 1/2,
          }}
        >
          <StyledLayout className="flex-row m-0 items-center justify-between">
            <StyledLayout>
              <StyledText className="text-left text-sm" numberOfLines={2}>
                {item.content}
              </StyledText>
              <>
                {item.terms.map((term, index) => (
                  <StyledText key={index} className='text-xs text-gray-400 text-right my-2'>
                    * {term}
                  </StyledText>
                ))}
              </>
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
  };

  return (
    <FlatList
      data={Rewards}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default Incentives;
