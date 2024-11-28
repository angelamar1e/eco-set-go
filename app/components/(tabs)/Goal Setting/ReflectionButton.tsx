import React, { useEffect, useState } from 'react';
import { styled } from 'nativewind';
import { Button, Layout, Input, Text, Modal } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TouchableOpacity } from 'react-native';

const StyledButton = styled(Button);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledText = styled(Text);

const ReflectionButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [createmodalVisible, setcreateModalVisible] = useState(false);
  const [content, setContent] = useState(''); // Updated to use 'content' for input state
  const [date, setDate] = useState(new Date()); // State for date
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [uid, setUid] = useState<string | null>(null); // State for storing the user UID

  useEffect(() => {
    const fetchUserUid = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        setUid(currentUser.uid); // Store the UID in state
      } else {
        console.error("User is not authenticated");
      }
    };

    fetchUserUid(); // Call the function on mount
  }, []);

  const handlePress = () => {
    setcreateModalVisible(true);
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCreateReflection = async () => {
    if (content.trim().length > 0 && uid) { // Ensure there is content and a valid UID
      setLoading(true); // Start loading
      try {
        await firestore().collection('reflections').add({
          content: content,  // Use content state here
          uid: uid,           // Use the uid from state
          date: firestore.FieldValue.serverTimestamp(),
        });
        setContent(''); // Clear content after successful submission
        setcreateModalVisible(false); // Close modal
        setIsClicked(false); // Reset button state
      } catch (error) {
        console.error("Error adding reflection: ", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <StyledLayout>
      <TouchableOpacity 
        className='m-1 p-1 rounded-full flex-row items-center justify-center border border-[#8F9BB3]'
        style={{ width: 180, backgroundColor: '#F5F7F9' }}
        onPress={handlePress}
        disabled={loading}
      >
        <Ionicons name="pencil" size={20} color="#8F9BB3" />
        <StyledText 
          style={{ 
            fontFamily: 'Poppins-Medium',
            color: '#8F9BB3',
            marginLeft: 8,
            fontSize: 12,
            alignContent: 'center',
            justifyContent: 'center',
            top: 2
          }}
        >
          Create reflection
        </StyledText>
      </TouchableOpacity>

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
              disabled={loading} // Disable cancel button while loading
            >
              <StyledText>Cancel</StyledText>
            </StyledButton>
            <StyledButton
              className='m-1 rounded-full'
              status="success"
              appearance="ghost"
              size='small'
              onPress={handleCreateReflection}
              disabled={loading} // Disable create button while loading
            >
              {loading ? 'Creating...' : 'Create Reflection'}
            </StyledButton>
          </StyledLayout>
        </StyledLayout>
      </Modal>
    </StyledLayout>
  );
};

export default ReflectionButton;
