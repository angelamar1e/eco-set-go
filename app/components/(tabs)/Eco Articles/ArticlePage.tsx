import React, { useState } from 'react';
import { Image } from 'react-native';
import { Layout, Card, Text, Select, SelectItem } from '@ui-kitten/components'; 
import { styled } from 'nativewind';

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
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <StyledLayout className="flex-1 mt-10 p-2">
         <StyledText className='text-center'category='h5'>Category{category}</StyledText>

      <StyledLayout className="bg-[#4A8B2A] m-2 p-3 rounded-lg flex-row justify-between items-center">
        <StyledText category='h6'>Title{articleTitle}</StyledText>
      </StyledLayout>

      <StyledLayout className="flex-row m-1">
        {/* Column 1: Image Holder and Impact */}
        <StyledLayout className="flex-1">
          {/* Image Holder Card */}
          <StyledCard className="m-1">
            <Image
              source={{ uri: imageUri }} // Use the passed imageUri prop
              className="w-full h-40 rounded-lg"
            />
          </StyledCard>

          {/* Impact Card */}
          <StyledCard className='m-1'>
            <StyledText className='mb-2' category='h6'>Impact</StyledText>
            <Select
              placeholder='Select..'
              value={selected}
              onSelect={(index) => setSelected(index ? index.toString() : null)}
            >
              <SelectItem title='Option1' />
              <SelectItem title='Option2' />
              <SelectItem title='Option3' />
            </Select>
            <StyledText className='text-center mt-2' category='s1' appearance='hint'>
              100 kg{impact} 
            </StyledText>
          </StyledCard>
        </StyledLayout>

        {/* Column 2: Instructions, Facts, and Benefits */}
        <StyledLayout className="flex-1">
          <StyledCard className="m-1">
            <StyledText category='h6'>Instructions</StyledText>
            <StyledText category='s2' appearance='hint'>
            Lorem ipsum{instructions}
            </StyledText>
          </StyledCard>

          <StyledCard className="m-1">
            <StyledText category='h6'>Facts</StyledText>
            <StyledText category='s2' appearance='hint'>
             Lorem ipsum{facts}
            </StyledText>
          </StyledCard>

          <StyledCard className="m-1">
            <StyledText category='h6'>Benefits</StyledText>
            <StyledText category='s2' appearance='hint'>
            Lorem ipsum{benefits} 
            </StyledText>
          </StyledCard>
        </StyledLayout>
      </StyledLayout>
    </StyledLayout>
  );
};

export default ArticlePage;
