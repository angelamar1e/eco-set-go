import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { Image } from 'react-native';
import { styled } from 'nativewind';
import { myTheme } from '@/constants/custom-theme';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

export const TitleComponent = () => {
  return (
    <StyledLayout style={{ alignItems: 'center', bottom: 40 }}>
      <Image 
        source={require('../assets/images/logo.png')}
        style={{ 
          width: 400,
          height: 400,
          resizeMode: 'contain',
          marginBottom: -140
        }} 
      />
      {/*<StyledText 
        style={{ 
          textAlign: 'center',
          fontFamily: 'Poppins-SemiBold',
          fontSize: 12,
          color: myTheme['color-basic-600']
        }}>
        Everyday Habits for a Greener Tomorrow
      </StyledText>*/}
    </StyledLayout>
  );
};
