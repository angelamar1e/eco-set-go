import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Layout, Card } from '@ui-kitten/components';
import { styled } from 'nativewind';
import BackButton from './BackButton';

const StyledLayout = styled(Layout);
const StyledText = styled(Text);

const Introduction = () => {
  return (
    <StyledLayout className="flex-1 p-4">
      <BackButton/>
      <StyledText category="h6" className="text-center mb-4">
        Introduction to Carbon Footprint
      </StyledText>
      <ScrollView>
        <StyledLayout>
          <StyledText category="h6" className="m-2">
            CO2 footprint
          </StyledText>
          <StyledLayout className="flex-row items-start m-1 p-2 rounded-md shadow-lg">
          <StyledText category="h5" className="ml-2 mr-2">🍃</StyledText>
            <StyledText category='p2' className="ml-2 mr-2 text-justify flex-shrink">
            The IPCC defines carbon footprint as the “measure of the exclusive total amount of emissions of carbon dioxide (CO2) that is directly and indirectly caused by an activity or accumulated over the life stages of a product.”, 
            expressed in carbon dioxide equivalents (CO2e) for standardization, based on their global warming potential for a cohesive measure of environmental impact. 
            In the Philippines, the Climate Change Performance Index has recorded a national average per capita emissions with 2.27 tons CO2e.
            </StyledText>
          </StyledLayout>
        </StyledLayout>

        <StyledLayout>
          <StyledText category="h6" className="m-2">
          Which gases carbon footprint encompass?
          </StyledText>
          <StyledLayout className="flex-row items-start m-1 p-2 rounded-md shadow-lg">
          <StyledText category="h5" className="ml-2 mr-2">🍃</StyledText>
            <StyledText category='p2' className="ml-2 mr-2 text-justify flex-shrink">
            A carbon footprint is composed of various greenhouse gases (GHGs),  each contributing differently to global warming:
            {'\n'}<StyledText category='p2' className='font-bold'>Carbon Dioxide (CO2): </StyledText>Makes up about 76% of global GHG emissions, primarily from fossil fuel combustion, deforestation, and industrial processes. Its volume and longevity in the atmosphere make it a key contributor to the greenhouse effect.
            {'\n'}<StyledText category='p2' className='font-bold'>Methane (CH4): </StyledText> Represents about 16% of emissions and is over 25 times more effective than CO2 at trapping heat. Methane emissions result from  production and transport of fossil fuel, livestock and other agricultural practices.
            {'\n'}<StyledText category='p2' className='font-bold'>Nitrous Oxide (N2O): </StyledText> Accounts for around 6% of emissions, with a global warming potential 298 times that of CO2. It primarily comes from agriculture, industry, and burning biomass.
            </StyledText>
          </StyledLayout>
        </StyledLayout>

        <StyledLayout>
          <StyledText category="h6" className="m-2">
          Sources of the emissions
          </StyledText>
          <StyledLayout className="flex-row items-start m-1 p-2 rounded-md shadow-lg">
          <StyledText category="h5" className="ml-2 mr-2">🍃</StyledText>
            <StyledText category='p2' className="ml-2 mr-2 text-justify flex-shrink">
            Our everyday actions, whether as individuals or within organizations, have a significant impact on the global carbon footprint.
            {'\n'}<StyledText category='p2' className='font-bold'>Transportation: </StyledText>This sector accounts for around 17.9% of global greenhouse gas emissions. This includes emissions from all forms of transport–including cars, airplanes, ships, and trains, which are primarily fuelled by harmful fuels. For individuals, this involves daily commutes and travel.
            {'\n'}<StyledText category='p2' className='font-bold'>Energy Production: </StyledText> The generation of electricity and heat is the largest single source of global GHG emissions, contributing about 39.3, stemming mainly from burning fuels like coal, natural gas, and oil. Its consumption through heating, cooling, and electricity usage within homes and buildings contribute around 9.9% to global greenhouse gas emissions. The efficiency of appliances and the choice of energy sources play a key role in the carbon footprint of these activities. 
            {'\n'}<StyledText category='p2' className='font-bold'>Agriculture: </StyledText>This sector is responsible for about 12% of global GHG emissions. It includes emissions from livestock production, rice cultivation, and the use of nitrogenous fertilizers, which produce methane and nitrous oxide.
          </StyledText>
          </StyledLayout>
        </StyledLayout>
        
      </ScrollView>
    </StyledLayout>
  );
};

export default Introduction;
