import React, { useState } from 'react';
import { TouchableOpacity, View, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import firestore from '@react-native-firebase/firestore'; 
import { Timestamp } from '@react-native-firebase/firestore';

interface PostCardProps {
  id: string;
  content: string;
  userName: string;
  timestamp: Timestamp; 
  onEdit: (newContent: string) => void; 
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);
const StyledView = styled(View);

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
  const [editedContent, setEditedContent] = useState(content);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleCommentSubmit = () => {
    console.log('Comment submitted:', comment);
    setComment('');
  };

  const handleHeartPress = () => {
    setIsHearted(!isHearted); 
    console.log('Heart pressed!');
  };

  const handleEditSubmit = async () => {
    setLoading(true); 
    try {
      await onEdit(editedContent); 
      setEditModalVisible(false); // Close modal after editing
    } catch (error) {
      Alert.alert('Error', 'Could not edit the post. Please try again later.');
    } finally {
      setLoading(false); 
    }
  };

  const onDelete = async () => {
    try {
      await firestore().collection('posts').doc(id).delete(); 
      console.log('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post: ', error);
      Alert.alert('Error', 'Could not delete the post. Please try again later.');
    }
  };

  const confirmDeletePost = () => {
    onDelete(); 
    setConfirmDeleteVisible(false); 
    setShowMenu(false); 
  };

  const handleDeletePress = () => {
    setConfirmDeleteVisible(true); 
  };

  const formattedTimestamp = formatTimeAgo(timestamp);

  return (
    <StyledCard className="p-1 mb-2 ml-2 mr-2 rounded-lg">
      <StyledLayout className="flex-row justify-between">
        <View>
          <StyledText category='s1' className='font-bold'>@{userName}</StyledText>
          <StyledText category='c1' className='text-gray-500'>{formattedTimestamp}</StyledText>
        </View>

        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#A9A9A9" />
        </TouchableOpacity>
      </StyledLayout>

      <StyledLayout className="mt-2">
        <StyledText category='p1'>{content}</StyledText>
      </StyledLayout>

      <StyledLayout className="flex-row items-center justify-between mt-2">
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
          <StyledButton
            size='small'
            className='font-bold'
            appearance='ghost'
            status='info'
            onPress={() => {
              setEditModalVisible(true); 
              setShowMenu(false); 
            }}
          > Edit
          </StyledButton>
          <StyledButton
            size='small'
            className='font-bold'
            appearance='ghost'
            status='danger'
            onPress={handleDeletePress}
          > Delete
          </StyledButton>
        </View>
      )}

      {/* Edit Modal */}
      <Modal
        transparent={true}
        visible={editModalVisible}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg" style={{ width: '90%', maxWidth: 400 }}>
                <StyledInput
                  multiline={true}
                  value={editedContent}
                  onChangeText={setEditedContent}
                  className='rounded-lg'
                />
                <StyledLayout className="flex-row justify-end mt-2">
                  <StyledButton
                    onPress={handleEditSubmit}
                    status="success"
                    appearance="filled"
                    size='small'
                    className='rounded-full'
                  >
                    Finish Editing
                  </StyledButton>
                </StyledLayout>
              </StyledLayout>
            </TouchableWithoutFeedback>
          </StyledLayout>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={confirmDeleteVisible}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setConfirmDeleteVisible(false)}>
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg">
                <StyledText>Are you sure you want to delete this post?</StyledText>
                <StyledLayout className="flex-row justify-between mt-4">
                  <StyledButton 
                    className='font-bold'
                    appearance='ghost'
                    status='info'
                    onPress={() => {
                      setConfirmDeleteVisible(false);
                      setShowMenu(false); 
                    }}>
                      Cancel
                  </StyledButton>
                  <StyledButton 
                    className='font-bold'
                    status='danger'
                    appearance='ghost'
                    onPress={confirmDeletePost}>
                      Delete
                  </StyledButton>
                </StyledLayout>
              </StyledLayout>
            </TouchableWithoutFeedback>
          </StyledLayout>
        </TouchableWithoutFeedback>
      </Modal>
    </StyledCard>
  );
};

export default PostCard;
