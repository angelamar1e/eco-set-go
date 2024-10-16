import React from 'react';
import { View, Text, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface EcoNewsCardProps {
  image: string;
  headline: string;
  lead: string;
  source: string;
}

const EcoNewsCard: React.FC<EcoNewsCardProps> = ({ image, headline, lead, source }) => {
  return (
    <View className="h-[110px] w-[300px] bg-white p-4 rounded-lg mb-2 mx-2 shadow-md">
      <View className="flex-row items-start">
        <Image source={{ uri: image }} className="w-16 h-16 rounded-md mr-4" alt="News Thumbnail" />
        <View className="flex-1">
          <ThemedText type='default'className="font-bold text-lg">{headline}</ThemedText>
          <ThemedText type='default' className="text-gray-600 mt-1">{lead}</ThemedText>
          <ThemedText type='default' className="text-blue-500 text-sm mt-2">{source}</ThemedText>
        </View>
      </View>
    </View>
  );
};

export default EcoNewsCard;
