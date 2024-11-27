import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Layout, Modal, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const StyledButton = styled(Button);
const StyledInput = styled(Input);
const StyledLayout = styled(Layout);
const StyledCard = styled(Card);

export const CreatePost = (): React.ReactElement => {
  const [value, setValue] = useState('');
  const [userName, setUserName] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUserName = async (userUid: string) => {
    try {
      const userDoc = await firestore().collection('users').doc(userUid).get();
      if (userDoc.exists) {
        setUserName(userDoc.data()?.username);
      }
    } catch (error) {
      console.error("Error fetching username: ", error);
    }
  };

  useEffect(() => {
    const fetchUserUid = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        fetchUserName(currentUser.uid);
      }
    };

    fetchUserUid();
  }, []);

  const handlePostSubmit = async () => {
    if (value.trim().length > 0 && userName) {
      setLoading(true);
      try {
        await firestore().collection('posts').add({
          content: value,
          userName: userName, 
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        setValue('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (error) {
        console.error("Error adding post: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <StyledCard className="mt-16 ml-2 mr-2">
      <StyledLayout className="flex-row items-center mb-3">
        <StyledInput
          className="flex-1 rounded-lg"
          placeholder="Share your thoughts... 💭"
          value={value}
          onChangeText={setValue}
          multiline={true}
        />
      </StyledLayout>

      <StyledLayout className="flex-row justify-between">
        <StyledLayout className="flex-row items-center">
          <Pressable onPress={() => console.log('Attach image')}>
            <Ionicons size={22} name="image-outline" color="#34C759" />
          </Pressable>
        </StyledLayout>
        
        <StyledButton
          className="ml-1 rounded-full"
          status="success"
          size="small"
          appearance="filled"
          disabled={value.length === 0 || loading}
          onPress={handlePostSubmit}
        >
          {loading ? 'Posting...' : 'Post'}
        </StyledButton>
      </StyledLayout>

      <Modal
        visible={success}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setSuccess(false)}
      >
        <Card disabled={true}>
          <Text>Post successfully added! 🎉</Text>
        </Card>
      </Modal>
    </StyledCard>
  );
};

export default CreatePost;
