import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Layout, Modal} from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { myTheme } from '@/constants/custom-theme';

const StyledButton = styled(Button);
const StyledInput = styled(Input);
const StyledLayout = styled(Layout);
const StyledCard = styled(Card);
const StyledText = styled(Text);

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
      <StyledLayout className="flex-row items-center mb-3 " style={{backgroundColor: myTheme['color-basic-200']}}>
        <StyledInput
          className="flex-1 rounded-lg"
          placeholder="Share your thoughts... 💭"
          value={value}
          onChangeText={setValue}
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

      <StyledLayout className="flex-row justify-between" style={{backgroundColor: myTheme['color-basic-200']}}>
        <StyledLayout className="flex-row items-center" style={{backgroundColor: myTheme['color-basic-200']}}>
          <Pressable onPress={() => console.log('Attach image')}>
            <Ionicons size={22} name="image-outline" color="#34C759" />
          </Pressable>
        </StyledLayout>
        
        <TouchableOpacity
          className="mt-2 mb-2 w-1/3 rounded-full"
          onPress={handlePostSubmit}
          style={{backgroundColor: myTheme['color-basic-400'], padding: 3}}
        >
          <Text style={{ 
            fontFamily: 'Poppins-Medium', 
            textAlign: 'center', 
            fontSize: 12, 
            top: 1,
            color: value.trim() ? myTheme['color-success-700'] : myTheme['color-basic-600']
          }}>
            {loading ? 'Posting...' : 'Post'}
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
            Post successfully added! 🎉
          </StyledText>
        </Card>
      </Modal>
    </StyledCard>
  );
};

export default CreatePost;
