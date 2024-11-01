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

export const CreateListing = (): React.ReactElement => {
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState<string | undefined>();
  const [price, setPrice] = useState('');
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

  const handleListingSubmit = async () => {
    if (description.trim().length > 0 && price.trim().length > 0 && userName) {
      setLoading(true);
      try {
        await firestore().collection('listings').add({
          content: description,
          userName: userName,
          price: parseFloat(price),
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        setDescription('');
        setPrice('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (error) {
        console.error("Error adding listing: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <StyledLayout className="mt-12 mb-2 ml-2 mr-2 p-3 rounded-lg border border-gray-200">
      <StyledLayout className="items-center">
        <StyledInput
          className="mt-2 mb-2 flex-1 rounded-lg"
          placeholder="Item description... 🏷️"
          value={description}
          onChangeText={setDescription}
          multiline={true}
        />
        <StyledInput
          className="mt-2 mb-2 flex-1 rounded-lg"
          placeholder="Price... 💰"
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
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
          disabled={description.length === 0 || price.length === 0 || loading}
          onPress={handleListingSubmit}
        >
          {loading ? 'Listing...' : 'List'}
        </StyledButton>
      </StyledLayout>

      <Modal
        visible={success}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setSuccess(false)}
      >
        <Card disabled={true}>
          <Text>Listing successfully added! 🎉</Text>
        </Card>
      </Modal>
    </StyledLayout>
  );
};

export default CreateListing;
