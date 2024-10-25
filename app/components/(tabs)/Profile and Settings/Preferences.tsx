import React from 'react';
import { Toggle, Input, Text, Layout, Divider } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledToggle = styled(Toggle);
const StyledDivider = styled(Divider);


interface PreferencesProps {
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
  actionReminders: boolean;
  setActionReminders: (value: boolean) => void;
}

const Preferences: React.FC<PreferencesProps> = ({
  pushNotifications,
  setPushNotifications,
  actionReminders,
  setActionReminders,
}) => (
  <StyledLayout className="m-2 p-2">
    <StyledLayout className='mt-4 ml-2 mr-2 p-1 flex flex-row'>
      <StyledText category='h6'>Push notifications</StyledText>
      <StyledToggle
        className='ml-auto'
        checked={pushNotifications}
        onChange={setPushNotifications}
      />
    </StyledLayout>
    
    <StyledDivider className='ml-2 mr-2 mt-5'></StyledDivider>

    <StyledLayout className='mb-4 mt-4 ml-2 mr-2 p-1 flex flex-row'>
      <StyledText category='h6'>Action reminders</StyledText>
      <StyledToggle
        className='ml-auto'
        checked={actionReminders}
        onChange={setActionReminders}
      />
    </StyledLayout>

  
  </StyledLayout>
);

export default Preferences;
