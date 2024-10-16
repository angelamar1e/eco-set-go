import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ScrollView } from 'react-native-gesture-handler';
import ConvertButton from './ConvertButton';

interface Incentives {
  id: string;
  title: string;
  content: string;
  points: number;
}

const Incentives = () => {
  // State to hold the dummy incentives data
  const [Incentives] = useState<Incentives[]>([
    { id: '1', title: '5% OFF', content: 'Any single item purchase from Brand', points:3000 },
    { id: '2', title: 'Plant a Tree', content: 'Support OrgName environmental cause', points: 5000  },
    { id: '3', title: 'Register for free', content: 'OrgName fun run for a cause', points: 7000 },
  ]);

  const renderItem = ({ item }: { item: Incentives }) => (
    <View className='items-center'>
        <Card className='mb-3 h-[120px] bg-stone-100 w-[90%]'>
        <Card.Content className=''>
            <ThemedText type='defaultSemiBold' className='text-lg text-black left-[100px] mt-1'>{item.title}</ThemedText>
            <ThemedText type='default' className='text-[13px] text-black italic left-[100px] mb-1'>{item.content}</ThemedText>
            
            <View className='flex-row justify-between mt-2'>
                <View className='bg-stone-200 w-[31%] left-[98px] rounded-full flex-row justify-between py-1 px-3'>
                    <ThemedText type='defaultSemiBold' className='text-[13px] text-black'>{item.points}</ThemedText>
                    <ThemedText type='default' className='text-[13px] text-black'>EcoPoints</ThemedText>
                </View>
                <ConvertButton />
            </View>
        </Card.Content>
        </Card>
    </View>
  );

  return (
    <FlatList
        data={Incentives}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
    />
  );
};

export default Incentives;
