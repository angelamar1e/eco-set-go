import React, { useState } from 'react';
import { Image } from 'react-native';
import { Layout, Card, Text, Select, SelectItem } from '@ui-kitten/components'; 
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

interface ArticlePageProps {
  articleTitle: string;
  imageUri: string;
  instructions: string;
  facts: string;
  benefits: string;
  impact: string;  
  category: string; 
}

// Styled components using NativeWind
const StyledLayout = styled(Layout);
const StyledCard = styled(Card);
const StyledText = styled(Text);

const ArticlePage: React.FC<ArticlePageProps> = ({
  articleTitle,
  imageUri,
  instructions,
  facts,
  benefits,
  impact,
  category,   
}) => {
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null);
  
  return (
    <StyledLayout className="flex-1 mt-10 p-2">
      <StyledText className='text-center' category='h5'>
        Category: {category}
      </StyledText>

      <StyledLayout className="bg-[#4A8B2A] m-2 p-3 rounded-lg flex-row justify-between items-center">
        <StyledText category='h6'>
          Title: {articleTitle}
        </StyledText>
      </StyledLayout>

      <StyledLayout className="flex-row m-1">
        {/* Column 1: Image Holder and Equivalencies */}
        <StyledLayout className="flex-1">
          {/* Image Holder Card */}
          <StyledCard className="m-1">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-40 rounded-lg"
              accessibilityLabel={articleTitle} // Accessibility feature
            />
          </StyledCard>

          <StyledCard className="m-1">
            <StyledText category='h6'>Impact</StyledText>

            {/* Dropdown for Impact Selection */}
            <Select
              selectedIndex={selectedImpact}
              onSelect={(index) => setSelectedImpact(index)}
              placeholder="Select"
              className="mt-2"
            >
              <SelectItem title="Option 1" />
              <SelectItem title="Option 2" />
              <SelectItem title="Option 3" />
            </Select>

            <StyledText category='s2' appearance='hint'>
              {impact} CO2e
            </StyledText>
          </StyledCard>

          <StyledCard className="m-1">
            <StyledText category='h6'>Practical Impact</StyledText>
            <StyledLayout className="flex-col">
              <StyledLayout className="flex-row items-center">
                <Ionicons name="car" size={16} color="gray" />
                <StyledText category='s2' appearance='hint' className="ml-2">km driven</StyledText>
              </StyledLayout>
              <StyledLayout className="flex-row items-center">
                <Ionicons name="flame" size={16} color="red" />
                <StyledText category='s2' appearance='hint' className="ml-2">coal burned</StyledText>
              </StyledLayout>
              <StyledLayout className="flex-row items-center">
                <Ionicons name="trash" size={16} color="gray" />
                <StyledText category='s2' appearance='hint' className="ml-2">tons of waste recycled</StyledText>
              </StyledLayout>
              <StyledLayout className="flex-row items-center">
                <Ionicons name="leaf" size={16} color="green" />
                <StyledText category='s2' appearance='hint' className="ml-2">trees grown</StyledText>
              </StyledLayout>
            </StyledLayout>
          </StyledCard>
        </StyledLayout>

        {/* Column 2: Instructions, Facts, and Benefits */}
        <StyledLayout className="flex-1">
          <StyledCard className="m-1">
            <StyledText category='h6'>Instructions</StyledText>
            <StyledText category='s2' appearance='hint'>
              {instructions}
            </StyledText>
          </StyledCard>

          <StyledCard className="m-1">
            <StyledText category='h6'>Facts</StyledText>
            <StyledText category='s2' appearance='hint'>
              {facts}
            </StyledText>
          </StyledCard>

          <StyledCard className="m-1">
            <StyledText category='h6'>Benefits</StyledText>
            <StyledText category='s2' appearance='hint'>
              {benefits}
            </StyledText>
          </StyledCard>
        </StyledLayout>
      </StyledLayout>
    </StyledLayout>
  );
};

export default ArticlePage;
