import React, { useState } from 'react';
import { TouchableOpacity, View, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import { Timestamp } from '@react-native-firebase/firestore';

interface PostCardProps {
  id: string; // Add an id prop for the document ID in Firestore
  content: string;
  userName: string;
  timestamp: Timestamp; 
  onEdit: (newContent: string) => void; // Function to handle post editing
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const formatTimeAgo = (timestamp: Timestamp) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - timestamp.toDate().getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;

  return `${seconds} seconds ago`;
};

const PostCard: React.FC<PostCardProps> = ({ id, content, userName, timestamp, onEdit }) => {
  const [comment, setComment] = useState('');
  const [isHearted, setIsHearted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for editing

  const handleCommentSubmit = () => {
    console.log('Comment submitted:', comment);
    setComment('');
  };

  const handleHeartPress = () => {
    setIsHearted(!isHearted); 
    console.log('Heart pressed!');
  };

  const handleEditSubmit = async () => {
    setLoading(true); // Start loading
    try {
      await onEdit(editedContent); // Call the edit function with the new content
      setIsEditing(false);
      setShowMenu(false); // Close the menu after editing
    } catch (error) {
      Alert.alert('Error', 'Could not edit the post. Please try again later.'); // Handle error
    } finally {
      setLoading(false); // End loading
    }
  };

  const onDelete = async () => {
    try {
      await firestore().collection('posts').doc(id).delete(); // Delete the document with the specified ID
      console.log('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post: ', error);
      Alert.alert('Error', 'Could not delete the post. Please try again later.');
    }
  };

  const confirmDeletePost = () => {
    onDelete(); // Call the delete function
    setConfirmDeleteVisible(false); // Close the confirmation modal
  };

  const handleDeletePress = () => {
    setConfirmDeleteVisible(true); // Show confirmation modal
  };

  const formattedTimestamp = formatTimeAgo(timestamp);

  return (
    <StyledCard className="p-1 mb-2 ml-2 mr-2 rounded-lg">
      <StyledLayout className="flex-row justify-between">
        <View>
          <StyledText category='s1' className='font-bold'>@{userName}</StyledText>
          <StyledText category='c1' className='text-gray-500'>{formattedTimestamp}</StyledText>
        </View>

        {/* Edit and Delete Menu */}
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#A9A9A9" />
        </TouchableOpacity>
      </StyledLayout>

      <StyledLayout className="mt-2">
        <StyledText category='p1'>{isEditing ? (
          <>
            <StyledInput
              multiline={true}
              value={editedContent}
              onChangeText={setEditedContent}
              className="rounded-lg"
            />
            <StyledButton
              onPress={handleEditSubmit}
              status="success"
              size="small"
              appearance="filled"
              className="mt-2"
            >
              Finish Editing
            </StyledButton>
          </>
        ) : (
          content
        )}</StyledText>
      </StyledLayout>

      <StyledLayout className="flex-row items-center justify-between mt-2">
        {/* Heart button */}
        <TouchableOpacity onPress={handleHeartPress}>
          <Ionicons 
            name={isHearted ? "heart" : "heart-outline"} 
            size={20} 
            color={isHearted ? "#34C759" : "#A9A9A9"} 
          />
        </TouchableOpacity>

        <StyledInput
          className="flex-1 p-2 rounded-full ml-2"
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
          onSubmitEditing={handleCommentSubmit}
        />
      </StyledLayout>

      {/* Popup Menu */}
      {showMenu && (
        <View className="absolute right-0 top-0 mt-2 bg-white border border-gray-200 rounded shadow-lg p-2">
          <TouchableOpacity onPress={() => {
              setIsEditing(true);
              setEditedContent(content);
            }}>
            <Text className="p-2">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeletePress}>
            <Text className="p-2 text-red-600">Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={confirmDeleteVisible}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setConfirmDeleteVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <TouchableWithoutFeedback>
              <View className="bg-white p-5 rounded">
                <Text>Are you sure you want to delete this post?</Text>
                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity onPress={() => setConfirmDeleteVisible(false)}>
                    <Text className="text-blue-500">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={confirmDeletePost}>
                    <Text className="text-red-500">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </StyledCard>
  );
};

export default PostCard;
