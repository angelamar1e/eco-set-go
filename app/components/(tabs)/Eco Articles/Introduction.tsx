import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Layout, Card } from '@ui-kitten/components';
import { styled } from 'nativewind';
import BackButton from './BackButton';
import { useLoadFonts } from '@/assets/fonts/loadFonts';
import { myTheme } from "@/constants/custom-theme";

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const Introduction = () => {
  const fontsLoaded = useLoadFonts(); 

  return (
    <StyledLayout className="flex-1 p-4">
      <BackButton/>
      <StyledText 
        className="text-xl text-center mb-2" 
        style={{ fontFamily: 'Poppins-SemiBold' }}
      >
        Introduction to Carbon Footprint
      </StyledText>
      <ScrollView>
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
              A carbon footprint measures the total amount of carbon emissions caused by an activity or accumulated over a product's life stages, expressed in carbon dioxide equivalents (CO2e) for standardization. 
              In the Philippines, the Climate Change Performance Index has recorded a national average per capita emissions with 2.27 tons CO2e.
            </StyledText>
          </StyledLayout>
        </StyledLayout>

        <StyledLayout>
          <StyledText 
            category="p1" 
            className="m-1"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Key Greenhouse Gases
          </StyledText>
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
              A carbon footprint consists of several greenhouse gases (GHGs), each contributing to global warming to varying degrees. Carbon dioxide (CO2) accounts for the largest share of emissions, but smaller quantities of methane (CH4) and nitrous oxide (N2O) are also released. 
              Although they are emitted in lower amounts, methane and nitrous oxide are much more potent than carbon dioxide in terms of their warming effect.
            </StyledText>
          </StyledLayout>
        </StyledLayout>

        <StyledLayout>
          <StyledText 
            category="p1" 
            className="m-1"
            style={{ fontFamily: 'Poppins-SemiBold' }}
          >
            Emissions Sources
          </StyledText>
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
              Our everyday actions, whether as individuals or within organizations, have a significant impact on the global carbon footprint.
              {'\n'}<StyledText style={{ fontFamily: 'Poppins-Medium', fontSize: 13 }}>Transportation: </StyledText>This sector accounts for around 17.9% of global GHG emissions. This includes emissions from all forms of transport–including cars, airplanes, ships, and trains. For individuals, this involves daily commutes and travel.
              {'\n'}<StyledText style={{ fontFamily: 'Poppins-Medium', fontSize: 13 }}>Energy Production: </StyledText> The generation of electricity and heat contributes around 39.3% of the global emissions, while its consumption through heating, cooling, and electricity usage within homes and buildings contribute around 9.9% to global GHG emissions. 
              The efficiency of appliances and the choice of energy sources play a key role in the carbon footprint of these activities. 
              {'\n'}<StyledText style={{ fontFamily: 'Poppins-Medium', fontSize: 13 }}>Agriculture: </StyledText>This sector is responsible for about 12% of global GHG emissions. It includes emissions from livestock production, rice cultivation, and use of nitrogenous fertilizers which are the main producers of methane and nitrous oxide.
            </StyledText>
          </StyledLayout>
        </StyledLayout>
      </ScrollView>
    </StyledLayout>
  );
};

export default Introduction;
