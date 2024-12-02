import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Layout, Modal, Text } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { myTheme } from '@/constants/custom-theme';
import { useUserContext } from '@/contexts/UserContext';
import { sendNotification } from '../Settings/Preferences';

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
  const { userUid } = useUserContext();

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
          uid: userUid,
        });

        // Query all users with `postsNotificationsEnabled` set to true
        const usersSnapshot = await firestore()
          .collection('users')
          .where('postsNotificationsEnabled', '==', true)
          .get();
  
        // Filter out the current user from the list of users
        const filteredUsers = usersSnapshot.docs.filter(doc => doc.id !== userUid);
  
        const formatted = description.length > 50 ? `${description.trim().slice(0, 50)}...` : description.trim()
        // Notify each user
        const notificationPromises = filteredUsers.map(async (doc) => {
          const user = doc.data();
          if (user.expoPushToken) {
            await sendNotification(
              `@${userName} created a listing 🛒`,
              `${formatted} • ₱${price}`, // Trim and append ellipsis if longer than 50 characters
              user.expoPushToken,
              "community-posts"
            );
          }
        });
  
        // Wait for all notifications to complete
        await Promise.all(notificationPromises);
  

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
      className="mt-20 mx-3 bg-gray-100 rounded-xl" 
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
      <StyledLayout className="flex-row items-center mb-3" style={{backgroundColor: myTheme['color-basic-200']}}>
        <StyledInput
          className="flex-1 rounded-lg"
          placeholder="Item description... 🏷️"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          size='large'
          style={{
            borderColor: myTheme['color-success-600'],
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            top: 2,
          }}
          textStyle={{ fontFamily: 'Poppins-Regular', fontSize: 13, top: 2 }}
        />
      </StyledLayout>

      <StyledLayout className="flex-row items-center mb-3" style={{backgroundColor: myTheme['color-basic-200']}}>
        <StyledInput
          className="flex-1 rounded-lg"
          placeholder="Price... 💰"
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
          size='large'
          style={{
            borderColor: myTheme['color-success-600'],
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            top: 2,
          }}
          textStyle={{ fontFamily: 'Poppins-Regular', fontSize: 13, top: 2 }}
        />
      </StyledLayout>

      <StyledLayout className="flex-row justify-between" style={{backgroundColor: myTheme['color-basic-200']}}>
        <StyledLayout className="flex-row items-center" style={{backgroundColor: myTheme['color-basic-200']}}>
          <Pressable onPress={() => console.log('Attach image')}>
            <Ionicons size={22} name="image-outline" color="#34C759" />
          </Pressable>
        </StyledLayout>
        
        <TouchableOpacity
          className="mt-2 mb-2 w-1/3 rounded-full"
          onPress={handleListingSubmit}
          disabled={!description || !price || loading}
          style={{backgroundColor: myTheme['color-basic-400'], padding: 3}}
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
        <Card disabled={true}>
          <StyledText 
            style={{ 
              fontFamily: "Poppins-Regular",
              fontSize: 14,
              textAlign: 'center'
            }}
          >
            Listing successfully added! 🎉
          </StyledText>
        </Card>
      </Modal>
    </StyledCard>
  );
};

export default CreateListing;
