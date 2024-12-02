import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button, Modal, Popover } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Timestamp } from '@react-native-firebase/firestore';
import { formatTimeAgo, fetchUserInfo, fetchComments, handleAddComment, handleDeleteComment, handleEditListing, handleDeleteListing } from '@/app/utils/marketplaceUtils';
import { myTheme } from '@/constants/custom-theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserContext } from '@/contexts/UserContext';

export interface Comment {
  id: string;
  postId: string;
  userName: string;
  timestamp: Timestamp;
  content: string;
  uid: string,
}

interface ListingCardProps {
  id: string;
  content: string;
  userName: string;
  price: string;
  timestamp: Timestamp;
  uid: string,
  onEdit: (newContent: string, newPrice: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

const ListingCard: React.FC<ListingCardProps> = ({ id, content, userName, price, timestamp, uid, onEdit, onDelete }) => {
  const [editedContent, setEditedContent] = useState(content);
  const [editedPrice, setEditedPrice] = useState(price);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const {userUid, username} = useUserContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [confirmCommentDeleteVisible, setConfirmCommentDeleteVisible] = useState(false);
  const [postPopoverVisible, setPostPopoverVisible] = useState(false);
  const [commentPopoverVisible, setCommentPopoverVisible] = useState<string | null>(null);

  const formattedTimestamp = formatTimeAgo(timestamp);
  const handleAddCommentWrapper = async () => {
    if (newComment.trim()) {
      const addedComment = await handleAddComment(id, username, userUid, newComment);
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment(''); // Reset input field after comment is added
    }
  };

  const handleDeleteCommentWrapper = async () => {
    if (commentToDelete) {
      await handleDeleteComment(commentToDelete.id);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentToDelete.id));
      setConfirmCommentDeleteVisible(false);
    }
  };

  return (
    <StyledLayout 
      className="p-1 m-2 rounded-xl border border-gray-200" 
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
      <StyledLayout className="flex-row justify-between" style={{backgroundColor: myTheme['color-basic-200']}}>
        <StyledLayout style={{backgroundColor: myTheme['color-basic-200']}} className='flex-row w-11/12 items-center mb-3'>
          <StyledText  className=" ml-2 font-bold text-[90px] mt-4"><MaterialCommunityIcons name='emoticon-excited' size={50} color={myTheme['color-success-700']}/></StyledText>
          <StyledLayout className='flex-column w-[240px] mt-4' style={{backgroundColor: myTheme['color-basic-200']}}>
          <StyledText 
            className="ml-1 leading-5"
            style={{ fontFamily: 'Poppins-Italic', fontSize: 15, color: myTheme['color-success-900'] }}
          >
            @{userName}
          </StyledText>
          
          <StyledText 
            className="ml-2 text-gray-400"  
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 12
            }}
          >
            {formattedTimestamp}
          </StyledText>
          </StyledLayout>
        </StyledLayout>
        <StyledLayout className='m-1 p-1' style={{backgroundColor: myTheme['color-basic-200']}}>
          {uid === userUid && (
          <Popover
            visible={postPopoverVisible}
            placement="bottom end"
            anchor={() => (
              <TouchableOpacity onPress={() => setPostPopoverVisible(!postPopoverVisible)}>
                <Ionicons name="ellipsis-vertical" size={20} color={myTheme['color-basic-700']}/>
              </TouchableOpacity>
            )}
            onBackdropPress={() => setPostPopoverVisible(false)}
          >
            <StyledLayout className="p-1 rounded-lg">
              <TouchableOpacity 
                onPress={() => {
                  setEditModalVisible(true);
                  setPostPopoverVisible(false);
                }}
              >
                <StyledText style={{ 
                  fontFamily: 'Poppins-Medium', 
                  fontSize: 14,
                  color: myTheme['color-info-500'],
                  padding: 8
                }}>
                  Edit
                </StyledText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setConfirmDeleteVisible(true);
                  setPostPopoverVisible(false);
                }}
              >
                <StyledText style={{ 
                  fontFamily: 'Poppins-Medium', 
                  fontSize: 14,
                  color: myTheme['color-danger-500'],
                  padding: 8
                }}>
                  Delete
                </StyledText>
              </TouchableOpacity>
            </StyledLayout>
          </Popover>
          )}
        </StyledLayout>
      </StyledLayout>

      <StyledLayout className="mt-2 ml-5" style={{backgroundColor: myTheme['color-basic-200']}}>
        <StyledText className='text-lg' style={{ fontFamily: 'Poppins-Regular', }}>
          {content}
        </StyledText>
        <StyledText 
          className='text-lg'
          style={{ 
            fontFamily: 'Poppins-SemiBold',
            //fontSize: 14,
            marginTop: 4,
            color: myTheme['color-success-600']
          }}
        >
          ₱{price}
        </StyledText>
      </StyledLayout>

      {/* Comment Button */}
      <StyledLayout className='items-end mr-5' style={{backgroundColor: myTheme['color-basic-200']}}>
      <TouchableOpacity
        onPress={() => setCommentModalVisible(true)}
        className="mt-2 mb-2 w-1/3 rounded-full flex-row items-center justify-center"
        style={{backgroundColor: myTheme['color-basic-300'], padding: 8}}>
        <StyledText style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: myTheme['color-success-700'], top: 1 }}>Comments</StyledText>
      </TouchableOpacity>
      </StyledLayout>

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setCommentModalVisible(false)}
        style={{ width: 300, maxHeight: '80%', alignSelf: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText 
            style={{ 
              fontFamily: 'Poppins-SemiBold',
              fontSize: 16,
              marginBottom: 8
            }}
          >
            Comments
          </StyledText>
          <StyledInput
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            className="rounded-lg mb-3"
            size='large'
            textStyle={{ fontFamily: 'Poppins-Regular', fontSize: 14}}
            style={{ fontFamily: 'Poppins-Regular', fontSize: 14 }}
            accessoryRight={() => (
              <TouchableOpacity
                onPress={handleAddCommentWrapper}
                disabled={!newComment.trim()}
              >
                <Ionicons name="send" size={20} color={newComment.trim() ? "#34C759" : "#A9A9A9"} />
              </TouchableOpacity>
            )}
          />
          <ScrollView style={{ maxHeight: 400 }}>
            {comments.length > 0 ? (
              comments
                .slice()
                .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())
                .map((comment) => (
                  <View key={comment.id} className="pb-2 mb-2">
                    <StyledLayout className='flex-row justify-between'>
                      <StyledText style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14 , color: myTheme['color-success-700']}}>
                        @{comment.userName}
                      </StyledText>                     
                      {/* for comment actions */}
                      {comment.uid === userUid && (
                      <Popover
                        visible={commentPopoverVisible === comment.id}
                        placement="bottom end"
                        anchor={() => (
                          <TouchableOpacity onPress={() => setCommentPopoverVisible(comment.id)}>
                            <Ionicons name="ellipsis-vertical" size={20} color="#A9A9A9" />
                          </TouchableOpacity>
                        )}
                        onBackdropPress={() => setCommentPopoverVisible(null)}
                      >
                        <StyledLayout className="p-3 rounded-lg">
                          <TouchableOpacity
                            onPress={() => {
                              setCommentToDelete(comment);
                              setConfirmCommentDeleteVisible(true);
                              setCommentPopoverVisible(null);
                            }}
                          >
                            <StyledText
                              style={{
                                fontFamily: 'Poppins-Medium',
                                fontSize: 14,
                                color: myTheme['color-danger-500'],
                              }}
                            >
                              Delete Comment
                            </StyledText>
                          </TouchableOpacity>
                        </StyledLayout>
                      </Popover>
                      )}
                    </StyledLayout>
                   
                    <StyledText 
                      style={{ 
                        fontFamily: 'Poppins-Regular', 
                        fontSize: 16, 
                        backgroundColor: myTheme['color-basic-300'], 
                        padding: 5, 
                        paddingVertical: 16, 
                        borderRadius: 10,
                        flexWrap: 'wrap'
                      }}
                    >
                      {comment.content}
                    </StyledText>
                    <StyledText 
                      style={{ 
                        fontFamily: 'Poppins-Regular',
                        fontSize: 11,
                        color: '#8F9BB3'
                      }}
                    >
                      {formatTimeAgo(comment.timestamp)}
                    </StyledText>
                  </View>
                ))
            ) : (
              <StyledText className="text-gray-500" style={{ fontFamily: 'Poppins-Regular', fontSize: 12 }}>No comments yet.</StyledText>
            )}
          </ScrollView>
        </StyledLayout>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setEditModalVisible(false)}
        style={{ width: 300, height: 250, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
            Edit Listing
          </StyledText>
          <StyledInput
            value={editedContent}
            onChangeText={setEditedContent}
            placeholder="Edit your listing..."
            multiline
            className="mb-2 mt-2"
            textStyle={{ fontFamily: 'Poppins-Regular', fontSize: 13 }}
            style={{ fontFamily: 'Poppins-Regular' }}
          />
          <StyledInput
            value={editedPrice}
            onChangeText={setEditedPrice}
            placeholder="Edit price..."
            keyboardType="numeric"
            className="mb-2"
            textStyle={{ fontFamily: 'Poppins-Regular', fontSize: 13 }}
            style={{ fontFamily: 'Poppins-Regular' }}
          />
          <StyledLayout className="flex-row justify-between mt-3">
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              className="m-1 rounded-full"
            >
              <StyledText style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
                color: myTheme['color-info-500'],
                padding: 8
              }}>
                Cancel
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (editedContent !== content || editedPrice !== price) {
                  onEdit(editedContent, editedPrice);
                }
                setEditModalVisible(false);
              }}
              className="m-1 rounded-full"
            >
              <StyledText style={{
                fontFamily: 'Poppins-Medium', 
                fontSize: 14,
                color: myTheme['color-primary-700'],
                padding: 8
              }}>
                Save Changes
              </StyledText>
            </TouchableOpacity>
          </StyledLayout>
        </StyledLayout>
      </Modal>

      {/* Delete Confirmation Modals */}
      <Modal
        visible={confirmDeleteVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setConfirmDeleteVisible(false)}
        style={{ width: 300, height: 150, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
            Are you sure you want to delete this listing?
          </StyledText>
          <StyledLayout className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setConfirmDeleteVisible(false)}
              className="m-1 p-2 rounded-full flex-row items-center justify-center"
              style={{ backgroundColor: 'transparent' }}
            >
              <StyledText 
                style={{ 
                  fontFamily: 'Poppins-Medium', 
                  fontSize: 14,
                  color: myTheme['color-info-500']
                }}
              >
                Cancel
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await handleDeleteListing(id);
                setConfirmDeleteVisible(false);
              }}
              className="m-1 p-2 rounded-full flex-row items-center justify-center"
              style={{ backgroundColor: 'transparent' }}
            >
              <StyledText
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 14, 
                  color: myTheme['color-danger-500']
                }}
              >
                Delete
              </StyledText>
            </TouchableOpacity>
          </StyledLayout>
        </StyledLayout>
      </Modal>

      {/* Comment Deletion Confirmation Modal */}
      <Modal
        visible={confirmCommentDeleteVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setConfirmCommentDeleteVisible(false)}
        style={{ width: 300, height: 150, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
            Are you sure you want to delete this comment?
          </StyledText>
          <StyledLayout className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setConfirmCommentDeleteVisible(false)}
              className="m-1 p-2 rounded-full flex-row items-center justify-center"
              style={{ backgroundColor: 'transparent' }}
            >
              <StyledText 
                style={{ 
                  fontFamily: 'Poppins-Medium', 
                  fontSize: 14,
                  color: myTheme['color-info-500']
                }}
              >
                Cancel
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteCommentWrapper}
              className="m-1 p-2 rounded-full flex-row items-center justify-center"
              style={{ backgroundColor: 'transparent' }}
            >
              <StyledText
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 14, 
                  color: myTheme['color-danger-500']
                }}
              >
                Delete
              </StyledText>
            </TouchableOpacity>
          </StyledLayout>
        </StyledLayout>
      </Modal>
    </StyledLayout>
  );
};

export default ListingCard;