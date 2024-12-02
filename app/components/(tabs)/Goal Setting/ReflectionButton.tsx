import React, { useEffect, useState } from 'react';
import { styled } from 'nativewind';
import { Button, Layout, Input, Text, Modal } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { myTheme } from '@/constants/custom-theme';

const StyledButton = styled(Button);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledText = styled(Text);

const ReflectionButton = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [createmodalVisible, setcreateModalVisible] = useState(false);
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserUid = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        setUid(currentUser.uid);
      } else {
        console.error('User is not authenticated');
      }
    };

    fetchUserUid();
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
    if (content.trim().length > 0 && uid) {
      setLoading(true);
      try {
        await firestore().collection('reflections').add({
          content: content,
          uid: uid,
          date: firestore.FieldValue.serverTimestamp(),
        });
        setContent('');
        setcreateModalVisible(false);
        setIsClicked(false);
      } catch (error) {
        console.error('Error adding reflection: ', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <StyledLayout>
      <TouchableOpacity
        className="m-1 p-1 rounded-2xl flex-row items-center justify-center border"
        style={{ width: 110, backgroundColor: '#F5F7F9', borderColor: myTheme['color-success-700'] }}
        onPress={handlePress}
        disabled={loading}
      >
        <Ionicons name="pencil" size={20} color={myTheme['color-success-700']} />
        <StyledText
          className="leading-4"
          style={{
            fontFamily: 'Poppins-Medium',
            color: myTheme['color-success-700'],
            marginLeft: 8,
            fontSize: 12,
            alignContent: 'center',
            justifyContent: 'center',
            top: 2,
          }}
        >
          Create reflection
        </StyledText>
      </TouchableOpacity>

      {/* Modal for Creating Reflection */}
      <Modal
        visible={createmodalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        style={{ width: 800, height: 150, alignSelf: 'center', justifyContent: 'center' }}
        // No onRequestClose here
      >
        {/* Prevent the modal from closing when touching its content */}
        <TouchableWithoutFeedback>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StyledLayout className="p-5 rounded-lg">
              <TouchableOpacity
                className="m-1 p-2 rounded-lg flex-row items-center justify-center"
                onPress={() => setShowDatePicker(true)}
              >
                <StyledText
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    color: myTheme['color-success-700'],
                  }}
                >
                  {formattedDate}
                </StyledText>
              </TouchableOpacity>

              <StyledInput
                className="m-1"
                placeholder="Share your thoughts... 💭"
                value={content}
                onChangeText={setContent}
                multiline={true}
                size='large'
                textStyle={{ 
                  fontFamily: 'Poppins-Regular', 
                  fontSize: 14, 
                  top: 2,
                  maxHeight: 100 // Limit text input height
                }}
                style={{ 
                  fontFamily: 'Poppins-Regular', 
                  width: 300,
                  maxHeight: 100 // Match textStyle maxHeight
                }}
                scrollEnabled={true}
                textAlignVertical="top"
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
                <TouchableOpacity
                  onPress={() => setcreateModalVisible(false)}
                  disabled={loading}
                  className="m-1 p-2 rounded-full flex-row items-center justify-center"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <StyledText
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      color: myTheme['color-info-500'],
                    }}
                  >
                    Cancel
                  </StyledText>
                </TouchableOpacity>

                <TouchableOpacity
                  className="m-1 p-2 rounded-full flex-row items-center justify-center"
                  style={{ backgroundColor: 'transparent' }}
                  onPress={handleCreateReflection}
                  disabled={loading}
                >
                  <StyledText
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      color: myTheme['color-success-700'],
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Reflection'}
                  </StyledText>
                </TouchableOpacity>
              </StyledLayout>
            </StyledLayout>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </StyledLayout>
  );
};

export default ReflectionButton;
