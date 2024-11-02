import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { styled } from 'nativewind';
import { Text } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { myTheme } from '@/constants/custom-theme';

const StyledButton = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

interface FilterDateProps {
  onToggle: (isClicked: boolean) => void; 
  onDateChange: (startDate: Date | null, endDate: Date | null) => void; 
}

const FilterDate: React.FC<FilterDateProps> = ({ onToggle, onDateChange }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null); // Controls both pickers

  const handlePress = () => {
    const newState = !isClicked;
    setIsClicked(newState);
    onToggle(newState);
    if (!newState) {
      // Reset dates and hide date picker when toggled off
      setShowDatePicker(null);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined, isStart: boolean) => {
    if (event.type === 'set' && selectedDate) {
      if (isStart) {
        setStartDate(selectedDate);
        onDateChange(selectedDate, endDate);
      } else {
        setEndDate(selectedDate);
        onDateChange(startDate, selectedDate);
      }
    }
    // Hide the picker after date selection
    setShowDatePicker(null);
  };

  return (
    <StyledView>
      <StyledButton
        onPress={handlePress}
        className="flex-row items-center border rounded-full p-1 px-3 py-1 m-1"
        style={{
          borderColor: myTheme['color-basic-600'],
          backgroundColor: myTheme['color-basic-transparent-100'],
        }}
      >
        <Ionicons name="calendar" size={18} color="#8F9BB3" />
        <Text category="label" style={{ color: myTheme['color-basic-600'], marginLeft: 5, marginRight: 5 }}>
          Filter date
        </Text>
        {isClicked ? (
          <Ionicons name="chevron-up" size={13} color="#8F9BB3" />
        ) : (
          <Ionicons name="chevron-down" size={13} color="#8F9BB3" />
        )}
      </StyledButton>

      {isClicked && (
        <StyledView className="p-2 bg-white rounded-lg">
          <Text category="s1">Start Date:</Text>
          <StyledButton onPress={() => setShowDatePicker('start')}>
            <Text>{startDate ? startDate.toLocaleDateString() : "Select Start Date"}</Text>
          </StyledButton>

          <Text category="s1">End Date:</Text>
          <StyledButton onPress={() => setShowDatePicker('end')}>
            <Text>{endDate ? endDate.toLocaleDateString() : "Select End Date"}</Text>
          </StyledButton>
        </StyledView>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={(showDatePicker === 'start' ? startDate : endDate) || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios' ? showDatePicker : null); // Hides picker on selection
            handleDateChange(event, selectedDate, showDatePicker === 'start');
          }}
        />
      )}
    </StyledView>
  );
};

export default FilterDate;
