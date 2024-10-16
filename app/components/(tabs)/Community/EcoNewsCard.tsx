import React from 'react';
import { View, Text, Image } from 'react-native';

interface EcoNewsCardProps {
  image: string;
  headline: string;
  lead: string;
  source: string;
}

const EcoNewsCard: React.FC<EcoNewsCardProps> = ({ image, headline, lead, source }) => {
  return (
    <View className="h-[110px] bg-white p-4 rounded-lg mb-2 mx-2 shadow-md">
      <View className="flex-row items-start">
        <Image source={{ uri: image }} className="w-16 h-16 rounded-md mr-4" alt="News Thumbnail" />
        <View className="flex-1">
          <Text className="font-bold text-lg">{headline}</Text>
          <Text className="text-gray-600 mt-1">{lead}</Text>
          <Text className="text-blue-500 text-sm mt-2">{source}</Text>
        </View>
      </View>
    </View>
  );
};

export default EcoNewsCard;
