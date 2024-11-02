import React, { useState } from 'react';
import { TouchableOpacity, View, Modal, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { editReflection, confirmDeleteReflection } from '@/app/utils/reflectionUtils';
import { Timestamp } from '@react-native-firebase/firestore';

interface ReflectionCardProps {
  id: string;
  content: string;
  timestamp: Timestamp;
  uid: string;
  onEdit: (newContent: string) => Promise<void>; // Accept onEdit prop
  onDelete: () => Promise<void>; // Accept onDelete prop
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const ReflectionCard: React.FC<ReflectionCardProps> = ({ id, content, timestamp, onEdit, onDelete }) => {
  const [editedContent, setEditedContent] = useState(content);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleEdit = async () => {
    await onEdit(editedContent); // Use onEdit prop
    setEditModalVisible(false);
  };

  const formattedDate = (timestamp instanceof Timestamp ? timestamp.toDate() : new Date()).toLocaleString();

  return (
    <StyledCard className="p-1 mb-2 ml-2 mr-2 rounded-lg">
      <StyledLayout className="flex-row justify-between">
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#A9A9A9" />
        </TouchableOpacity>
      </StyledLayout>

      <StyledLayout className="mt-2">
        <StyledText category='p1'>{content}</StyledText>
        <StyledText category='s1'>{formattedDate}</StyledText>
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
          > 
            <StyledText>Edit</StyledText>
          </StyledButton>
          <StyledButton
            size='small'
            className='font-bold'
            appearance='ghost'
            status='danger'
            onPress={() => {
              setConfirmDeleteVisible(true);
              setShowMenu(false);
            }}>
            <StyledText>Delete</StyledText>
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
                    onPress={handleEdit}
                    status="success"
                    appearance="filled"
                    size='small'
                    className='rounded-full'
                  >
                    <StyledText>Finish Editing</StyledText>
                  </StyledButton>
                </StyledLayout>
              </StyledLayout>
            </TouchableWithoutFeedback>
          </StyledLayout>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal
        transparent={true}
        visible={confirmDeleteVisible}
        animationType="slide"
      >
        <TouchableWithoutFeedback onPress={() => setConfirmDeleteVisible(false)}>
          <StyledLayout className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <TouchableWithoutFeedback>
              <StyledLayout className="bg-white p-5 rounded-lg">
                <StyledText>Are you sure you want to delete this reflection?</StyledText>
                <StyledLayout className="flex-row justify-between mt-4">
                  <StyledButton 
                    className='font-bold'
                    appearance='ghost'
                    status='info'
                    onPress={() => setConfirmDeleteVisible(false)}>
                    <StyledText>Cancel</StyledText>
                  </StyledButton>
                  <StyledButton
                    className='font-bold'
                    appearance='ghost'
                    status='danger'
                    onPress={async () => {
                      await onDelete(); // Use onDelete prop
                      setConfirmDeleteVisible(false);
                    }}>
                    <StyledText>Delete</StyledText>
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

export default ReflectionCard;
