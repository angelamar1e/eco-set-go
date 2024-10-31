import React, { useState } from 'react';
import { TouchableOpacity, View, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { formatTimeAgo, handleCommentSubmit, handleHeartPress, handleEditSubmit, confirmDeletePost, handleDeletePress } from '@/app/utils/communityUtils';
import { Timestamp } from '@react-native-firebase/firestore';

interface PostCardProps {
  id: string;
  content: string;
  userName: string;
  timestamp: Timestamp; 
  onEdit: (newContent: string) => Promise<void>; 
  onDelete: () => Promise<void>;
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const PostCard: React.FC<PostCardProps> = ({ id, content, userName, timestamp, onEdit }) => {
  const [editedContent, setEditedContent] = useState(content);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

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
            onPress={() => handleDeletePress(setConfirmDeleteVisible, setShowMenu)}>
            Delete
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
                    onPress={() => handleEditSubmit(onEdit, editedContent, setEditModalVisible, setLoading)} 
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
                    appearance='ghost'
                    status='danger'
                    onPress={() => confirmDeletePost(id, setConfirmDeleteVisible, setShowMenu)}>
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
