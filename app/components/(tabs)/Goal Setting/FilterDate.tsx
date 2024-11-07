// FilterDate.tsx
import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { Text, Layout, Popover, Button } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { myTheme } from '@/constants/custom-theme';

const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledResetButton = styled(Button);

interface FilterDateProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const FilterDate: React.FC<FilterDateProps> = ({ onDateChange }) => {
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);

  const handleDateChange = (event: any, selectedDate: Date | undefined, isStart: boolean) => {
    if (event.type === 'set' && selectedDate) {
      if (isStart) {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
    setShowDatePicker(null);
  };

  const togglePopover = () => setVisible(!visible);

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    onDateChange(null, null);
    setVisible(false); // Close popover after resetting
  };

  const confirmFilter = () => {
    onDateChange(startDate, endDate);
    setVisible(false); // Close popover after confirming
  };

  return (
    <StyledLayout style={{ position: 'relative', zIndex: 2 }}>
      <StyledButton
        onPress={togglePopover}
        className="flex-row items-center border rounded-full p-1 px-3 py-1 m-1"
        style={{
          borderColor: myTheme['color-basic-600'],
          backgroundColor: myTheme['color-basic-transparent-100'],
        }}
      >
        <Ionicons name="calendar" size={18} color="#8F9BB3" />
        <StyledText category="label" style={{ color: myTheme['color-basic-600'], marginLeft: 5, marginRight: 5 }}>
          Filter date
        </StyledText>
        <Ionicons name={visible ? "chevron-up" : "chevron-down"} size={13} color="#8F9BB3" />
      </StyledButton>

      <Popover
        anchor={() => <View />}
        visible={visible}
        onBackdropPress={() => setVisible(false)}
      >
        <StyledLayout style={{ padding: 10 }}>
          <StyledText category="p2" style={{ color: myTheme['color-basic-600'], fontWeight: 'bold' }}>
            Start Date:
          </StyledText>
          <StyledButton onPress={() => setShowDatePicker('start')} className="mb-2">
            <StyledText category="p2">
              {startDate ? startDate.toLocaleDateString() : 'Select Start Date'}
            </StyledText>
          </StyledButton>

          <StyledText category="p2" style={{ color: myTheme['color-basic-600'], fontWeight: 'bold' }}>
            End Date:
          </StyledText>
          <StyledButton onPress={() => setShowDatePicker('end')} className="mb-2">
            <StyledText category="p2">
              {endDate ? endDate.toLocaleDateString() : 'Select End Date'}
            </StyledText>
          </StyledButton>

          <StyledResetButton
            onPress={resetFilter}
            appearance="ghost"
            status="danger"
            size="small"
            style={{ marginVertical: 5 }}
          >
            Reset Filter
          </StyledResetButton>

          <Button onPress={confirmFilter} appearance="filled" size="small">
            Confirm
          </Button>
        </StyledLayout>
      </Popover>

      {showDatePicker && (
        <DateTimePicker
          value={(showDatePicker === 'start' ? startDate : endDate) || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios' ? showDatePicker : null);
            handleDateChange(event, selectedDate, showDatePicker === 'start');
          }}
        />
      )}
    </StyledLayout>
  );
};

export default FilterDate;
