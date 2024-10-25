import React from 'react';
import { ScrollView } from 'react-native';
import { Toggle, Input, Text, Layout } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledToggle = styled(Toggle);


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
  <ScrollView className="px-4">
    <StyledText className="text-lg font-bold text-green-800 mt-4">
      Push notifications
    </StyledText>
    <StyledText className="text-gray-600">
      Stay up to date with all things happening in your app
    </StyledText>
    <Toggle
      checked={pushNotifications}
      onChange={setPushNotifications}
      className="my-4"
    />

    <StyledText className="text-lg font-bold text-green-800 mt-4">
      Action reminders
    </StyledText>
    <StyledText className="text-gray-600">
      Handy nudges to track your carbon-busting actions
    </StyledText>
    <Toggle
      checked={actionReminders}
      onChange={setActionReminders}
      className="my-4"
    />
    <Input
      placeholder="Mon, Wed, Fri, Sat"
      value="16:30"
      accessoryRight={<Ionicons name="chevron-forward-outline" />}
      className="my-2"
    />

    <StyledText className="text-lg font-bold text-green-800 mt-4">
      Newsletter
    </StyledText>
    <StyledText className="text-gray-600">
      Our email, full of tips, tricks, and updates
    </StyledText>
    <Toggle
      checked={newsletter}
      onChange={setNewsletter}
      className="my-4"
    />

  </ScrollView>
);

export default Preferences;
