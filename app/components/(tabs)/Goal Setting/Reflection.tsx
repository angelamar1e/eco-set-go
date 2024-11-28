import React, { useState } from 'react';
import { TouchableOpacity, View, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button, Popover, Modal } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { editReflection, confirmDeleteReflection } from '@/app/utils/reflectionUtils';
import { Timestamp } from '@react-native-firebase/firestore';

interface ReflectionCardProps {
  id: string;
  content: string;
  date: Timestamp;
  uid: string;
  onEdit: (newContent: string) => Promise<void>; // Type for onEdit prop
  onDelete: () => Promise<void>; // Type for onDelete prop
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const ReflectionCard: React.FC<ReflectionCardProps> = ({ id, content, date, onEdit, onDelete }) => {
  const [editedContent, setEditedContent] = useState(content);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleDelete = async () => {
    await confirmDeleteReflection(id);
    setConfirmDeleteVisible(false);
    onDelete();
  };

  const formattedDate = (date instanceof Timestamp ? date.toDate() : new Date()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <StyledLayout className="m-1 p-1 rounded-lg border border-gray-200">
      <StyledLayout className="m-1 p-1 flex-row justify-between">
        <StyledText className="font-bold" category='s1'>{formattedDate}</StyledText>
        <Popover
          placement="bottom end"
          visible={showMenu}
          anchor={() => (
            <TouchableOpacity onPress={() => setShowMenu(true)}>
              <Ionicons name="ellipsis-vertical" size={15} color="#A9A9A9" />
            </TouchableOpacity>
          )}
          onBackdropPress={() => setShowMenu(false)}
        >
          <StyledLayout className="rounded shadow-lg">
            <StyledButton
              size='small'
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
              appearance='ghost'
              status='danger'
              onPress={() => {
                setConfirmDeleteVisible(true);
                setShowMenu(false);
              }}
            >
              <StyledText>Delete</StyledText>
            </StyledButton>
          </StyledLayout>
        </Popover>
      </StyledLayout>

      <StyledLayout>
        <StyledText className="ml-2 mb-1" category='p1'>{content}</StyledText>
      </StyledLayout>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setEditModalVisible(false)}
        style={{ width: 300, height: 250, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText category="h6" className="font-bold">
            Edit Post
          </StyledText>
          <StyledInput
            value={editedContent}
            onChangeText={setEditedContent}
            placeholder="Edit your post..."
            multiline
            className="mb-2 mt-2"
          />
          <StyledLayout className="flex-row justify-between mt-3">
            <StyledButton
              appearance="ghost"
              status="info"
              size="small"
              className="m-1 rounded-full"
              onPress={() => setEditModalVisible(false)}
            >
              Cancel
            </StyledButton>
            <StyledButton
              onPress={() => {
                if (editedContent !== content) {
                  onEdit(editedContent);
                }
                setEditModalVisible(false);
              }}
              appearance="ghost"
              status="primary"
              size="small"
              className="m-1 rounded-full"
            >
              Save Changes
            </StyledButton>
          </StyledLayout>
        </StyledLayout>
      </Modal>

      <Modal
        visible={confirmDeleteVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onBackdropPress={() => setConfirmDeleteVisible(false)}
        style={{ width: 300, height: 150, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText className=' m-2 text-center'>Are you sure you want to delete this reflection?</StyledText>
          <StyledLayout className="m-2 flex-row justify-between">
            <StyledButton
              className='font-bold rounded-full'
              appearance='ghost'
              status='info'
              size='small'
              onPress={() => setConfirmDeleteVisible(false)}
            >
              <StyledText>Cancel</StyledText>
            </StyledButton>
            <StyledButton
              className='font-bold rounded-full'
              appearance='ghost'
              status='danger'
              size='small'
              onPress={handleDelete}
            >
              <StyledText>Delete</StyledText>
            </StyledButton>
          </StyledLayout>
        </StyledLayout>
      </Modal>
    </StyledLayout>
  );
};

export default ReflectionCard;
