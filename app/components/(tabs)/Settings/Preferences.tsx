import React, { useState } from 'react'; 
import { Toggle, Text, Layout, Divider, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { styled } from 'nativewind';

const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledToggle = styled(Toggle);
const StyledDivider = styled(Divider);
const StyledSelect = styled(Select);
const StyledSelectItem = styled(SelectItem);

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
}) => {
  const [selectedFrequencyIndex, setSelectedFrequencyIndex] = useState<IndexPath | null>(null);
  const frequencyOptions = ['Once a day', 'Twice a day', 'Thrice a day'];

  const handleSelected = (index: IndexPath | IndexPath[]) => {
    const selectedIndex = Array.isArray(index) ? index[0] : index;
    setSelectedFrequencyIndex(selectedIndex);
  };

  const selectedFrequency = selectedFrequencyIndex
    ? frequencyOptions[selectedFrequencyIndex.row]
    : 'Select frequency';

  return (
    <StyledLayout className="m-2 p-2">
      <StyledLayout className="mt-4 ml-2 mr-2 p-1 flex flex-row">
        <StyledText category="h6">Push notifications</StyledText>
        <StyledToggle
          className="ml-auto"
          checked={pushNotifications}
          onChange={setPushNotifications}
        />
      </StyledLayout>
      
      <StyledDivider className="ml-2 mr-2 mt-5" />

      <StyledLayout className="mb-4 mt-4 ml-2 mr-2 p-1 flex flex-row">
        <StyledText category="h6">Action reminders</StyledText>
        <StyledToggle
          className="ml-auto"
          checked={actionReminders}
          onChange={(value) => {
            setActionReminders(value);
            if (!value) {
              setSelectedFrequencyIndex(null); 
            }
          }}
        />
      </StyledLayout>

      {actionReminders && (
        <StyledLayout className="ml-2 mr-2">
          <StyledSelect
            className="w-full"
            placeholder="Select frequency"
            value={selectedFrequency}
            selectedIndex={selectedFrequencyIndex}
            onSelect={handleSelected}
          >
            {frequencyOptions.map((option, index) => (
              <StyledSelectItem
                key={index}
                title={option}
              />
            ))}
          </StyledSelect>
        </StyledLayout>
      )}
    </StyledLayout>
  );
};

export default Preferences;
