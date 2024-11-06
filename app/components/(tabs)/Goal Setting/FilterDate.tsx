import React, { useState, useEffect } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Text, Layout, Button } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { myTheme } from '@/constants/custom-theme';

const StyledButton = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);

interface FilterDateProps {
  onToggle: (isClicked: boolean) => void;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const FilterDate: React.FC<FilterDateProps> = ({ onToggle, onDateChange }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    if (startDate || endDate) {
      onDateChange(startDate, endDate);
    }
  }, [startDate, endDate]);

  const handlePress = () => {
    const newState = !isClicked;
    setIsClicked(newState);
    //onToggle(newState);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined, isStart: boolean) => {
    if (event.type === 'set' && selectedDate) {
      if (isStart) {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
      setShowDatePicker(null);
    }
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    onDateChange(null, null);
  };

  return (
    <StyledLayout style={{ position: 'relative', zIndex: 2 }}>
      <StyledButton
        onPress={handlePress}
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
        {isClicked ? (
          <Ionicons name="chevron-up" size={13} color="#8F9BB3" />
        ) : (
          <Ionicons name="chevron-down" size={13} color="#8F9BB3" />
        )}
      </StyledButton>

      {isClicked && (
        <StyledLayout
          className="border rounded-lg p-1 px-3 py-1 m-1"
          style={{
            borderColor: myTheme['color-basic-600'],
            backgroundColor: myTheme['color-basic-transparent-100'],
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <StyledText category="p2" className="text-left font-bold" style={{ color: myTheme['color-basic-600'] }}>
            Start Date:
          </StyledText>
          <StyledButton onPress={() => setShowDatePicker('start')}>
            <StyledText category="p2" className="text-left font-bold">
              {startDate ? startDate.toLocaleDateString() : 'Select Start Date'}
            </StyledText>
          </StyledButton>

          <StyledText category="p2" className="text-left font-bold" style={{ color: myTheme['color-basic-600'] }}>
            End Date:
          </StyledText>
          <StyledButton onPress={() => setShowDatePicker('end')}>
            <StyledText category="p2" className="text-left font-bold">
              {endDate ? endDate.toLocaleDateString() : 'Select End Date'}
            </StyledText>
          </StyledButton>

          {/* Reset Button */}
          <StyledButton onPress={resetFilters} style={{ marginTop: 10 }}>
            <StyledText category="label" style={{ color: '#8B0000' }}>
              Reset Filter
            </StyledText>
          </StyledButton>
        </StyledLayout>
      )}

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
