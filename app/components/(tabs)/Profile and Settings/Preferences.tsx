import React from 'react';
import { ScrollView } from 'react-native';
import { Toggle, Input, Text, Layout, Divider } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledToggle = styled(Toggle);
const StyledDivider = styled(Divider);


interface PreferencesProps {
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
  actionReminders: boolean;
  setActionReminders: (value: boolean) => void;
  newsletter: boolean;
  setNewsletter: (value: boolean) => void;
}

const Preferences: React.FC<PreferencesProps> = ({
  pushNotifications,
  setPushNotifications,
  actionReminders,
  setActionReminders,
  newsletter,
  setNewsletter,
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
    
    <StyledDivider className='ml-2 mr-2'></StyledDivider>

    <StyledLayout className='mb-4 mt-4 ml-2 mr-2 p-1 flex flex-row'>
      <StyledText category='h6'>Action reminders</StyledText>
      <StyledToggle
        className='ml-auto'
        checked={actionReminders}
        onChange={setActionReminders}
      />
    </StyledLayout>

    <StyledDivider className='ml-2 mr-2'></StyledDivider>

    <StyledLayout className='mb-4 mt-4 ml-2 mr-2 p-1 flex flex-row'>
      <StyledText category='h6'>Action notifications</StyledText>
      <StyledToggle
        className='ml-auto'
        checked={actionReminders}
        onChange={setActionReminders}
      />
    </StyledLayout>

  
  </StyledLayout>
);

export default Preferences;
