import React from 'react';
import { Layout, Text } from '@ui-kitten/components';

export const TitleComponent = () => {
  return (
    <Layout style={{ alignItems: 'center', marginVertical: 16 }}>
      <Text category="h1" style={{ textAlign: 'center'}}>
        Eco Set Go
      </Text>
      <Text category="s1" style={{ textAlign: 'center'}}>
        Everyday Habits for a Greener Tomorrow
      </Text>
    </Layout>
  );
};
