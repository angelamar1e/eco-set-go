import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import storage from '@react-native-firebase/storage';
import { myTheme } from '@/constants/custom-theme'; // Ensure you have this import

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
    <StyledLayout className="h-[150px] w-[300px] rounded-lg mb-2 mx-2 shadow-xl border border-gray-200">
      <StyledLayout className="flex-row items-start">
        <StyledLayout>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} className="w-[130px] h-full rounded-l-md" accessibilityLabel="News Thumbnail" />
        )}
        </StyledLayout>
      
        <StyledLayout className="flex-1 m-2 p-2">
          <StyledText category='p2' className="font-bold text-gray-800">
            {headline}
          </StyledText>
          <StyledText category='c1' className="text-gray-600">
            {date}
          </StyledText>
        </StyledLayout>
      </StyledLayout>
    </StyledLayout>
  );
};

export default EcoNewsCard;
