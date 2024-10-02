import React, { FC } from 'react';
import { ProgressBar } from 'react-native-paper';
import { View } from 'react-native';

interface ProgressBarProps {
  progress: number;
}

export const Progress: FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View className="p-1">
      <ProgressBar progress={progress} color="green" />
    </View>
  );
};
