import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Linking, useColorScheme } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import storage from '@react-native-firebase/storage';
import { myTheme } from '@/constants/custom-theme';

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
  const colorScheme = useColorScheme();  // Hook to detect color scheme (light or dark mode)

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

  const handlePress = () => {
    if (link) {
      Linking.openURL(link).catch((err) => console.error("Failed to open link: ", err));
    }
  };

  // Dynamically apply the border color based on the color scheme
  // const borderClass = colorScheme === 'dark' ? 'border-black' : 'border-gray-200';

  return (
    <StyledLayout
      className={`h-[150px] w-[300px] rounded-lg mb-2 mx-2 border border-gray-200`}
      style={{
        backgroundColor: myTheme['color-basic-200'],
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.5,
        elevation: 2,
      }}
    >
      <StyledLayout className="flex-row items-start" style={{backgroundColor: myTheme['color-basic-200']}}>
        <StyledLayout>
          {imageUrl && (
            <TouchableOpacity onPress={handlePress}>
              <Image source={{ uri: imageUrl }} className="w-[130px] h-full rounded-l-md" accessibilityLabel="News Thumbnail" />
            </TouchableOpacity>
          )}
        </StyledLayout>

        <StyledLayout className="flex-1 m-2 p-2" style={{backgroundColor: myTheme['color-basic-200']}}>
          <TouchableOpacity onPress={handlePress}>
            <StyledText 
              className="" 
              style={{
                color: myTheme['color-success-700'],
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                lineHeight: 16
              }}
              numberOfLines={6}
              ellipsizeMode="tail"
            >
              {headline}
            </StyledText>
          </TouchableOpacity>
        </StyledLayout>
      </StyledLayout>
    </StyledLayout>
  );
};

export default EcoNewsCard;
