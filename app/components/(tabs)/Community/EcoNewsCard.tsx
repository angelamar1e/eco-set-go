import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import storage from '@react-native-firebase/storage';

interface EcoNewsCardProps {
  thumbnail: string;
  headline: string;
  date: string;
  link: string;
}

const StyledCard = styled(Card);
const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const EcoNewsCard: React.FC<EcoNewsCardProps> = ({ thumbnail, headline, date, link }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const getDownloadUrl = async (gsUrl: string): Promise<string | null> => {
    try {
      const ref = storage().refFromURL(gsUrl);
      return await ref.getDownloadURL();
    } catch (error) {
      console.error("Error fetching image URL: ", error);
      return null;
    }
  };  

  useEffect(() => {
    const loadImage = async () => {
      if (thumbnail.startsWith('gs://')) {
        const url = await getDownloadUrl(thumbnail);
        setImageUrl(url);
      } else {
        setImageUrl(thumbnail);
      }
    };
    loadImage();
  }, [thumbnail]);

  return (
    <StyledCard className="h-[160px] w-[300px] p-1 rounded-lg mb-2 mx-2 shadow-md">
      <StyledLayout className="flex-row items-start">
        {imageUrl && (
          <Image source={{ uri: imageUrl }} className="w-16 h-16 rounded-md mr-4" accessibilityLabel="News Thumbnail" />
        )}
        <StyledLayout className="flex-1">
          <StyledText category='p1' className="font-bold">
            {headline}
          </StyledText>
          <StyledText category='c1'>
            {date}
          </StyledText>
        </StyledLayout>
      </StyledLayout>
    </StyledCard>
  );
};

export default EcoNewsCard;
