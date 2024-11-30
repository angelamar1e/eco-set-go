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
const StyledText = styled(Text);

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
    const currentUser = auth().currentUser;
    if (currentUser) {
      fetchUserName(currentUser.uid);
    }
  }, []);

  const handleListingSubmit = async () => {
    if (description && price && userName) {
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
    <StyledCard className="h-100 mt-12 mb-2 ml-2 mr-2 rounded-lg">
      <StyledInput
        className="mt-2 mb-2 rounded-lg"
        placeholder="Item description... 🏷️"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        textStyle={{ 
          fontFamily: 'Poppins-Regular',
          fontSize: 13,
          top: 2
        }}
      />
      <StyledInput
        className="mt-2 mb-2 rounded-lg"
        placeholder="Price... 💰"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
        textStyle={{ 
          fontFamily: 'Poppins-Regular',
          fontSize: 13,
          top: 2
        }}
      />
      <StyledLayout className="flex-row justify-between">
        <Pressable onPress={() => console.log('Attach image')}>
          <Ionicons size={22} name="image-outline" color="#34C759" />
        </Pressable>
        <StyledButton
          className="ml-1 rounded-full px-4 py-0"
          status="success"
          size="small"
          appearance="filled"
          disabled={!description || !price || loading}
          onPress={handleListingSubmit}
        >
          {evaProps => (
            <Text 
              style={{ 
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                color: 'white'
              }}
            >
              {loading ? 'Listing...' : 'List'}
            </Text>
          )}
        </StyledButton>
      </StyledLayout>

      <Modal
        visible={success}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setSuccess(false)}
      >
        <Card disabled={true}>
        <StyledText 
            style={{ 
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              textAlign: 'center'
            }}
          >Listing successfully added! 🎉
        </StyledText>
        </Card>
      </Modal>
    </StyledCard>
  );
};

export default CreateListing;
