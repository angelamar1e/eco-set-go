import { myTheme } from '@/constants/custom-theme';
import { Layout, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import React, { FC } from 'react';
import { Pressable } from 'react-native';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

interface StepperProps {
  title: string;
  frequency: number; 
  onChange: (value: number) => void; 
}

const Stepper: FC<StepperProps> = ({ title, frequency: value, onChange }) => {
  // Increment the frequency
  const increment = () => {
    onChange(value + 1);  // Pass updated number
  };

  // Decrement the frequency (with lower bound at 0)
  const decrement = () => {
    if (value > 0) {
      onChange(value - 1);  // Pass updated number
    }
  };

  return (
    <StyledLayout 
      className="flex-row items-center justify-between py-2 px-4 mb-2 rounded-lg"
      style={{ borderWidth: 1, borderColor: myTheme['color-basic-400'] }}
    >
      <StyledLayout className='w-1/2'>
        <StyledText 
          style={{ 
            fontFamily: 'Poppins-SemiBold',
            fontSize: 14,
            color: myTheme['color-success-700'],
          }}
        >
          {title}
        </StyledText>
        <StyledText 
          style={{ 
            fontFamily: 'Poppins-Medium',
            fontSize: 12,
            color: myTheme['color-basic-600']
          }}
        >
          {value}x
        </StyledText>
      </StyledLayout>

      <StyledLayout className="flex-row justify-end"> 
        <Pressable 
          onPress={decrement} 
          style={{ backgroundColor: myTheme['color-success-700'] }}
          className="w-1/4 rounded-l-lg border-r border-white"
        >
          <StyledText 
            style={{ 
              fontFamily: 'Poppins-Medium',
              fontSize: 18,
              color: 'white',
              textAlign: 'center',
              top: 2
            }}
          >
            -
          </StyledText>
        </Pressable>

        <Pressable 
          onPress={increment} 
          style={{ backgroundColor: myTheme['color-success-700'] }}
          className="w-1/4 rounded-r-lg border-l border-white"
        >
          <StyledText 
            style={{ 
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              color: 'white',
              textAlign: 'center',
              top: 2
            }}
          >
            +
          </StyledText>
        </Pressable>
      </StyledLayout>
    </StyledLayout>
  );
};

export default Stepper;