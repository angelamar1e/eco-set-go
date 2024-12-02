import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Layout, Card } from '@ui-kitten/components';
import { styled } from 'nativewind';
import BackButton from './BackButton';
import { useLoadFonts } from '@/assets/fonts/loadFonts';
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);
const StyledCard = styled(Card);

const GoalSetting = () => {

  const fontsLoaded = useLoadFonts(); 

  return (
    <StyledLayout className="flex-1 p-4">
      <BackButton/>
      <StyledText  
        className="text-xl text-center mb-2" 
        style={{ fontFamily: 'Poppins-SemiBold' }}
      >
        Goal Guidelines
      </StyledText>
      <ScrollView>
        <StyledCard className='items-center m-2 rounded-lg' style={{ backgroundColor: myTheme['color-success-700']}}>
          <StyledText  
            className='text-white text-center'
            style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16 }}
          >
            about 2 tons of CO2e per year
          </StyledText>
          <StyledText 
            category='p2' 
            className='text-center text-white mt-2'
            style={{ fontFamily: 'Poppins-Regular' }}
          >
            It is recommended that each Filipino aim for a carbon footprint of this amount to align with both global and national climate targets.
          </StyledText>
        </StyledCard>
        <StyledLayout>
          <StyledLayout className="flex-row items-start m-1 p-2 rounded-md shadow-lg">
            <StyledText 
              category="h5" 
              className="ml-2 mr-2"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              🍃
            </StyledText>
            <StyledText 
              category='p2' 
              className="ml-2 mr-2 text-justify flex-shrink"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Globally, the average carbon footprint is about 4 tons per person annually. 
              However, to meet the Paris Agreement and limit global warming to 1.5°C, this must drop to under 2 tons per person by 2050, as reported by The Nature Conservancy. 
              In the Philippines, the Climate Change Performance Index reports that the current per capita footprint is 2.27 tons.  
            </StyledText>
          </StyledLayout>
        </StyledLayout>

        <StyledLayout>
          <StyledLayout className="flex-row items-start m-1 p-2 rounded-md shadow-lg">
            <StyledText 
              category="h5" 
              className="ml-2 mr-2"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              🍃
            </StyledText>
            <StyledText 
              category='p2' 
              className="ml-2 mr-2 text-justify flex-shrink"
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              Under the Paris Agreement, the Philippines has committed to reducing its greenhouse gas emissions by 75% by 2030 as part of its Nationally Determined Contributions (NDC).
              This ambitious target covers key sectors such as agriculture, energy, transport, and waste management. 
              While the country's per capita footprint is relatively low, further reductions are needed to stay on track with climate goals and global obligations.
            </StyledText>
          </StyledLayout>
        </StyledLayout>
      </ScrollView>
    </StyledLayout>
  );
};

export default GoalSetting;
