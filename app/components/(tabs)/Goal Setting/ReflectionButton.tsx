import React, { useState } from 'react';
import { styled } from 'nativewind';
import { Button, Layout, Input } from '@ui-kitten/components';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createReflection } from '@/app/utils/reflectionUtils';
import { useUserContext } from '@/contexts/UserContext';

const StyledButton = styled(Button);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);

const ReflectionButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date()); // State for date
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { userUid } = useUserContext();

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleCreateReflection = async () => {
    await createReflection({ 
      content, 
      date: date.toISOString(), // Convert date to ISO string
      uid: userUid 
    });
    setContent(''); // Clear content after creating
    setModalVisible(false); // Close modal after creating
  };

  return (
    <StyledLayout>
      <StyledButton
        className='m-1 p-1 rounded-full'
        status={isClicked ? 'success' : 'basic'}
        size='small'
        appearance={isClicked ? "filled" : "outline"}
        accessoryLeft={() => (
          <Ionicons name="pencil" size={20} color="#8F9BB3" />
        )}
        onPress={handlePress}
      >
      </StyledButton>

      {/* Modal for Creating Reflection */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg" style={{ width: '90%', maxWidth: 400 }}>

              <StyledButton
                className='m-1'
                appearance="ghost"
                onPress={() => setShowDatePicker(true)}>
                {date.toLocaleDateString()}
              </StyledButton>
                
                <StyledInput
                  className='m-1'
                  placeholder="Reflection Content"
                  value={content}
                  onChangeText={setContent}
                  multiline={true}
                />
                

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate || date;
                      setShowDatePicker(false);
                      setDate(currentDate);
                    }}
                  />
                )}

                <StyledButton
                  className='m-1'
                  onPress={handleCreateReflection}>
                  Create Reflection
                </StyledButton>

              </StyledLayout>
            </TouchableWithoutFeedback>
          </StyledLayout>
        </TouchableWithoutFeedback>
      </Modal>
    </StyledLayout>
  );
};

export default ReflectionButton;
