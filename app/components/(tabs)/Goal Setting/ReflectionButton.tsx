import React, { useState } from 'react';
import { styled } from 'nativewind';
import { Button, Layout, Input, Text, Modal } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUserContext } from '@/contexts/UserContext';
import firestore from '@react-native-firebase/firestore';

const StyledButton = styled(Button);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledText = styled(Text);

const ReflectionButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [createmodalVisible, setcreateModalVisible] = useState(false);
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date()); // State for date
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { userUid } = useUserContext(); // Assuming `userUid` is provided by context

  const handlePress = () => {
    setcreateModalVisible(true);
  };

  const handleCreateReflection = async () => {
    if (content.trim().length > 0 && userUid) {  // Ensure content is not empty
      try {
        // Add reflection to Firestore
        await firestore().collection('reflections').add({
          content: content,
          uid: userUid,  // Use the userUid from context
          date: date.toISOString(), 
          timestamp: firestore.FieldValue.serverTimestamp(), 
        });

        setContent('');
        setcreateModalVisible(false);
        setIsClicked(false);
        
      } catch (error) {
        console.error("Error creating reflection: ", error);
      }
    }
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
        {/* Reflection button */}
      </StyledButton>

      {/* Modal for Creating Reflection */}
      <Modal
        visible={createmodalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onBackdropPress={() => setcreateModalVisible(false)}
        style={{ width: 300, height: 150, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledButton
            className='m-1'
            appearance="ghost"
            onPress={() => setShowDatePicker(true)}>
            {formattedDate}
          </StyledButton>

          <StyledInput
            className='m-1'
            placeholder="Share your thoughts... 💭"
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

          <StyledLayout className="flex-row justify-between mt-2">
            <StyledButton
              onPress={() => setcreateModalVisible(false)}
              appearance="ghost"
              status="info"
              size='small'
              className='m-1 rounded-full'
            >
              <StyledText>Cancel</StyledText>
            </StyledButton>
            <StyledButton
              className='m-1 rounded-full'
              status="success"
              appearance="ghost"
              size='small'
              onPress={handleCreateReflection}>
              Create Reflection
            </StyledButton>
          </StyledLayout>
        </StyledLayout>
      </Modal>
    </StyledLayout>
  );
};

export default ReflectionButton;
