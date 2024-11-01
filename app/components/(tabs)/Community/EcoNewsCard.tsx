import React from 'react';
import { Image } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';

interface EcoNewsCardProps {
  image: string;
  headline: string;
  lead: string;
  source: string;
}

const StyledCard = styled(Card);
const StyledLayout = styled(Layout);
const StyledText = styled(Text);


const EcoNewsCard: React.FC<EcoNewsCardProps> = ({ image, headline, lead, source }) => {
  return (
    <StyledCard className="h-[140px] w-[300px] p-4 rounded-lg mb-2 mx-2 shadow-md">
      <StyledLayout className="flex-row items-start">
        <Image source={{ uri: image }} className="w-16 h-16 rounded-md mr-4" accessibilityLabel="News Thumbnail" />
        <StyledLayout className="flex-1">
          <StyledText category='h6'>
            {headline}
          </StyledText>
          <StyledText category='s1'>
            {lead}
          </StyledText>
          <StyledText category='s2' className="text-blue-500">
            {source}
          </StyledText>
        </StyledLayout>
      </StyledLayout>
    </StyledCard>
  );
};

export default EcoNewsCard;
