import React, { useState, useEffect } from 'react'; 
import { TouchableOpacity, View, Modal, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Timestamp } from '@react-native-firebase/firestore';
import { formatTimeAgo } from '@/app/utils/communityUtils';

interface ListingCardProps {
  id: string;
  content: string;
  userName: string;
  price: string;
  timestamp: Timestamp;
  onEdit: (newContent: string, newPrice: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const ListingCard: React.FC<ListingCardProps> = ({ id, content, userName, price, timestamp, onEdit, onDelete }) => {
  const [editedContent, setEditedContent] = useState(content);
  const [editedPrice, setEditedPrice] = useState(price); 
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    if (editModalVisible) {
      setEditedContent(content);
      setEditedPrice(price); 
    }
  }, [editModalVisible, content, price]); 

  const closeMenu = () => setShowMenu(false);
  const formattedTimestamp = formatTimeAgo(timestamp);

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <StyledCard className="p-1 mb-2 ml-2 mr-2 rounded-lg">
        <StyledLayout className="flex-row justify-between">
          <View>
            <StyledText category="s1" className="font-bold">
              @{userName}
            </StyledText>
            <StyledText category="c1" className="text-gray-500">
              {formattedTimestamp}
            </StyledText>
          </View>

          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#A9A9A9" />
          </TouchableOpacity>
        </StyledLayout>

        <StyledLayout className="mt-2">
          <StyledText category="p1">{content}</StyledText>
        </StyledLayout>

        <StyledLayout className="mt-2">
          <StyledText category="p1" className="font-bold">
            ₱{price}
          </StyledText>
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
              Edit
            </StyledButton>

            <StyledButton
              size='small'
              className='font-bold'
              appearance='ghost'
              status='danger'
              onPress={() => {
                setConfirmDeleteVisible(true);
                setShowMenu(false);
              }} 
            >
              Delete
            </StyledButton>
          </View>
        )}

        {/* Edit Modal */}
        <Modal transparent={true} visible={editModalVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
            <StyledLayout className="flex-1 justify-center items-center bg-black bg-opacity-30">
              <TouchableWithoutFeedback>
                <StyledLayout className="bg-white p-5 m-2 rounded-lg" style={{ width: '90%', maxWidth: 400 }}>
                  <StyledText category="h6" className="mb-2">
                    Edit Listing
                  </StyledText>
                  <StyledInput
                    multiline={true}
                    value={editedContent}
                    onChangeText={setEditedContent}
                    className="rounded-lg"
                    placeholder="Edit your content"
                  />
                  <StyledInput
                    value={editedPrice}
                    onChangeText={setEditedPrice}
                    className="rounded-lg mt-2"
                    placeholder="Edit price"
                    keyboardType="numeric"
                  />
                  <StyledLayout className="flex-row justify-end mt-2">
                    <StyledButton
                      onPress={async () => {
                        await onEdit(editedContent, editedPrice); // Pass both content and price
                        setEditModalVisible(false);
                      }}
                      status="success"
                      appearance="filled"
                      size="small"
                      className="rounded-full"
                    >
                      Finish Editing
                    </StyledButton>
                  </StyledLayout>
                </StyledLayout>
              </TouchableWithoutFeedback>
            </StyledLayout>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal transparent={true} visible={confirmDeleteVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={() => setConfirmDeleteVisible(false)}>
            <StyledLayout className="flex-1 justify-center items-center bg-black bg-opacity-30">
              <TouchableWithoutFeedback>
                <StyledLayout className="bg-white p-5 rounded-lg">
                  <StyledText>Are you sure you want to delete this listing?</StyledText>
                  <StyledLayout className="flex-row justify-between mt-4">
                    <StyledButton
                      appearance="ghost"
                      status="info"
                      onPress={() => setConfirmDeleteVisible(false)}
                    >
                      Cancel
                    </StyledButton>
                    <StyledButton appearance="ghost" status="danger" onPress={onDelete}>
                      Delete
                    </StyledButton>
                  </StyledLayout>
                </StyledLayout>
              </TouchableWithoutFeedback>
            </StyledLayout>
          </TouchableWithoutFeedback>
        </Modal>
      </StyledCard>
    </TouchableWithoutFeedback>
  );
};

export default ListingCard;
