import React from 'react';
import { FlatList, View } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Swipeable } from 'react-native-gesture-handler';
import ConvertButton from './ConvertButton';
import { myTheme } from '@/constants/custom-theme';
import { Rewards } from '@/constants/Points';

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
    const renderLeftActions = () => (
      <StyledLayout 
        className="justify-center items-center w-11/12 h-full" 
        style={{ 
          backgroundColor: `${myTheme['color-success-700']}15`,
          borderRadius: 12,
        }}
      >
        <ConvertButton reqPoints={item.points} rewardId={index}/>
      </StyledLayout>
    );

    return (
      <StyledLayout 
        className="flex-row mx-3 my-1"
        style={{
          height: 150,
          shadowColor: myTheme['color-success-700'],
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        {/* Left Card - Icon & Title */}
        <StyledLayout className='w-1/3'>
          <Swipeable renderLeftActions={renderLeftActions}>
            <StyledCard
              className="rounded-xl items-center justify-between h-full px-2 py-2"
              style={{
                backgroundColor: `${myTheme['color-success-700']}12`,
                borderColor: `${myTheme['color-success-700']}15`,
                borderWidth: 1,
              }}
            >
              {/* Icon and Title */}
              <View className="items-center">
                <StyledText 
                  style={{ 
                    fontSize: 24,
                    marginBottom: 3,
                    color: myTheme['color-success-700'],
                  }}
                >
                  {item.icon}
                </StyledText>
                <StyledText
                  className="text-center"
                  style={{ 
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: myTheme['color-success-700'],
                    lineHeight: 14,
                    marginTop: 2
                  }}
                >
                  {item.title}
                </StyledText>
              </View>

              {/* Swipe Instruction */}
              <StyledText
                className="text-center"
                style={{ 
                  fontFamily: 'Poppins-Regular',
                  fontSize: 9,
                  color: myTheme['color-success-700'],
                  opacity: 0.8,
                  marginTop: 10,
                  textAlign: 'center',
                }}
              >
                Swipe to redeem →
              </StyledText>
            </StyledCard>
          </Swipeable>
        </StyledLayout>

        {/* Right Card - Content & Points */}
        <StyledCard
          className='flex-1 rounded-xl ml-1'
          style={{
            backgroundColor: 'white',
            borderColor: `${myTheme['color-basic-400']}20`,
            borderWidth: 1,
            padding: 10,
            elevation: 1,
          }}
        >
          {/* Content */}
          <StyledText 
            className="text-left mb-1.5" 
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 12,
              lineHeight: 16,
              color: myTheme['color-basic-800'],
            }}
            numberOfLines={2}
          >
            {item.content}
          </StyledText>

          {/* Terms */}
          <View className="mb-1.5">
            {item.terms.map((term, index) => (
              <View 
                key={index} 
                className="flex-row items-start mb-0.5"
              >
                <StyledText 
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 10,
                    color: myTheme['color-basic-600'],
                    marginRight: 3,
                  }}
                >
                  •
                </StyledText>
                <StyledText 
                  style={{
                    flex: 1,
                    fontFamily: 'Poppins-Regular',
                    fontSize: 10,
                    color: myTheme['color-basic-600'],
                    lineHeight: 14,
                  }}
                >
                  {term}
                </StyledText>
              </View>
            ))}
          </View>

          {/* Points */}
          <View 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 'auto',
              paddingTop: 4,
              borderTopWidth: 1,
              borderTopColor: `${myTheme['color-basic-400']}15`,
            }}
          >
            <View 
              style={{
                backgroundColor: `${myTheme['color-success-700']}08`,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <StyledText
                style={{ 
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 13,
                  color: myTheme['color-success-700'],
                }}
              >
                {item.points}
              </StyledText>
              <StyledText
                style={{ 
                  fontFamily: 'Poppins-Medium',
                  fontSize: 11,
                  color: myTheme['color-success-600'],
                  marginLeft: 3,
                }}
              >
                EcoPoints
              </StyledText>
            </View>
          </View>
        </StyledCard>
      </StyledLayout>
    );
  };

  return (
    <FlatList
      data={Rewards}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{
        paddingVertical: 2,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Incentives;
