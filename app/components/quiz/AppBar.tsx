import React, { FC } from 'react';
import { Appbar } from 'react-native-paper';

interface AppbarProps {
  onBackPress: () => void;
}

export const AppBar: FC<AppbarProps> = ({ onBackPress }) => {
  return (
    <Appbar.Header className="w-[100%]">
      <Appbar.BackAction onPress={onBackPress} />
      <Appbar.Content title="Initial Quiz" className="text-white" />
    </Appbar.Header>
  );
};
