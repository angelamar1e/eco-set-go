import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Layout, Modal, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { myTheme } from '@/constants/custom-theme';

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
    <StyledCard 
      className="h-100 mt-12 mb-2 ml-2 mr-2 rounded-lg"
      style={{
        backgroundColor: myTheme['color-basic-200'],
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.5,
        elevation: 2,
      }}
    >
      <StyledInput
        className="mt-2 mb-2 rounded-lg"
        placeholder="Item description... 🏷️"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        textStyle={{ 
          fontFamily: 'Poppins-Regular',
          fontSize: 13
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
          fontSize: 13
        }}
      />
      <StyledLayout className="flex-row justify-between" style={{backgroundColor: myTheme['color-basic-200']}}>
        <Pressable onPress={() => console.log('Attach image')}>
          <Ionicons size={22} name="image-outline" color="#34C759" />
        </Pressable>
        <TouchableOpacity
          className="mt-2 mb-2 w-1/3 rounded-full"
          onPress={handleListingSubmit}
          disabled={!description || !price || loading}
          style={{
            backgroundColor: myTheme['color-basic-400'],
            padding: 3
          }}
        >
          <Text style={{ 
            fontFamily: 'Poppins-Medium', 
            textAlign: 'center', 
            fontSize: 12, 
            top: 1,
            color: description && price ? myTheme['color-success-700'] : myTheme['color-basic-600']
          }}>
            {loading ? 'Listing...' : 'List'}
          </Text>
        </TouchableOpacity>
      </StyledLayout>

      <Modal
        visible={success}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setSuccess(false)}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText 
            style={{ 
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              textAlign: 'center'
            }}
          >
            Listing successfully added! 🎉
          </StyledText>
        </StyledLayout>
      </Modal>
    </StyledCard>
  );
};

export default CreateListing;
