import React from 'react';
import { Button, Layout } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledLayout = styled(Layout);
const StyledButton = styled(Button);

interface SettingsTabProps {
  selectedTab: 'Details' | 'Preferences';
  setSelectedTab: (tab: 'Details' | 'Preferences') => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ selectedTab, setSelectedTab }) => (
  <StyledLayout className="flex-row justify-center p-1 m-5 rounded-full absolute -bottom-11">
    <StyledButton
      className={`w-1/2 rounded-l-full ${selectedTab === 'Details' ? 'filled' : 'ghost'}`}
      appearance={selectedTab === 'Details' ? 'filled' : 'ghost'}
      onPress={() => setSelectedTab('Details')}
    >
      Details
    </StyledButton>
    <StyledButton
      className={`w-1/2 rounded-r-full ${selectedTab === 'Preferences' ? 'filled' : 'ghost'}`}
      appearance={selectedTab === 'Preferences' ? 'filled' : 'ghost'}
      onPress={() => setSelectedTab('Preferences')}
    >
      Preferences
    </StyledButton>
  </StyledLayout>
);

export default SettingsTab;
