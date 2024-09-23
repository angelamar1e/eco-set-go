import React from 'react';
import { ThemedText } from '@/components/ThemedText'; 
import { ThemedView } from './ThemedView';

export const TitleComponent = () => {
    return (
      <ThemedView>
        <ThemedText type="title" lightColor="black" darkColor="white" className="text-center">
          Eco Set Go
        </ThemedText>
        <ThemedText type="subtitle" lightColor="black" darkColor="white" className="text-center text-sm font-normal">
          Everyday Habits for Greener Tomorrow
        </ThemedText>
      </ThemedView>
    );
};
