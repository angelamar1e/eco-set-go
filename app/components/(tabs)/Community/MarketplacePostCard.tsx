import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button, Modal, Popover } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { Timestamp } from '@react-native-firebase/firestore';
import { formatTimeAgo, fetchUserInfo, fetchComments, handleAddComment, handleDeleteComment, handleEditListing, handleDeleteListing } from '@/app/utils/marketplaceUtils';

export interface Comment {
  id: string;
  postId: string;
  userName: string;
  timestamp: Timestamp;
  content: string;
}

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
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [uid, setUid] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [confirmCommentDeleteVisible, setConfirmCommentDeleteVisible] = useState(false);
  const [postPopoverVisible, setPostPopoverVisible] = useState(false);
  const [commentPopoverVisible, setCommentPopoverVisible] = useState<string | null>(null);

  const formattedTimestamp = formatTimeAgo(timestamp);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { username, uid } = await fetchUserInfo();
        setUsername(username);
        setUid(uid);
        
        const fetchedComments = await fetchComments(id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching user info or comments:', error);
      }
    };

    fetchData();
  }, [id]);  // Add id as a dependency to re-fetch comments when postId changes.

  const handleAddCommentWrapper = async () => {
    if (newComment.trim()) {
      const addedComment = await handleAddComment(id, username, uid, newComment);
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
    <StyledCard className="p-1 mb-2 ml-2 mr-2 rounded-lg">
      <StyledLayout className="flex-row justify-between">
        <View>
          <StyledText category="s1" className="font-bold">@{userName}</StyledText>
          <StyledText category="c1" className="text-gray-500">{formattedTimestamp}</StyledText>
        </View>

        <Popover
          visible={postPopoverVisible}
          placement="bottom end"
          anchor={() => (
            <TouchableOpacity onPress={() => setPostPopoverVisible(!postPopoverVisible)}>
              <Ionicons name="ellipsis-vertical" size={15} color="#A9A9A9" />
            </TouchableOpacity>
          )}
          onBackdropPress={() => setPostPopoverVisible(false)}
        >
          <StyledLayout className="p-1 rounded-lg">
            <StyledButton
              size="small"
              appearance="ghost"
              status="info"
              onPress={() => {
                setEditModalVisible(true);
                setPostPopoverVisible(false);
              }}
            >
              Edit
            </StyledButton>
            <StyledButton
              size="small"
              appearance="ghost"
              status="danger"
              onPress={() => setConfirmDeleteVisible(true)}
            >
              Delete
            </StyledButton>
          </StyledLayout>
        </Popover>
      </StyledLayout>

      <StyledLayout className="mt-2">
        <StyledText category="p1">{content}</StyledText>
      </StyledLayout>

      <StyledLayout className="mt-2">
        <StyledText category="p1" className="font-bold">₱{price}</StyledText>
      </StyledLayout>

      <StyledButton
        appearance="ghost"
        status="basic"
        size="small"
        onPress={() => setCommentModalVisible(true)}
        className="mt-2 items-center rounded-full flex-row"
      >
        <StyledText>Add a comment</StyledText>
      </StyledButton>

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setCommentModalVisible(false)}
        style={{ width: 300, height: 250, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText category="h6" className="mb-2">Comments</StyledText>

          {/* Comments List */}
          {comments.length > 0 ? (
            comments
              .slice()
              .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())
              .map((comment) => (
                <View key={comment.id} className="pb-2 mb-2">
                  <StyledLayout className="flex-row justify-between">
                    <StyledText className="font-bold">@{comment.userName}</StyledText>
                    <Popover
                      visible={commentPopoverVisible === comment.id}
                      placement="bottom end"
                      anchor={() => (
                        <TouchableOpacity onPress={() => setCommentPopoverVisible(commentPopoverVisible === comment.id ? null : comment.id)}>
                          <Ionicons name="ellipsis-vertical" size={15} color="#A9A9A9" />
                        </TouchableOpacity>
                      )}
                      onBackdropPress={() => setCommentPopoverVisible(null)}
                    >
                      <StyledLayout className="p-2 rounded-lg">
                        <StyledButton
                          size="small"
                          appearance="ghost"
                          status="danger"
                          onPress={() => {
                            setCommentToDelete(comment);
                            setConfirmCommentDeleteVisible(true);
                            setCommentPopoverVisible(null);
                          }}
                        >
                          Delete
                        </StyledButton>
                      </StyledLayout>
                    </Popover>
                  </StyledLayout>

                  <StyledText>{comment.content}</StyledText>
                  <StyledText className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</StyledText>
                </View>
              ))
          ) : (
            <StyledText className="text-gray-500">No comments yet.</StyledText>
          )}

          {/* New Comment Input */}
          <StyledInput
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            className="rounded-lg m-1"
            accessoryRight={() => (
              <TouchableOpacity
                onPress={handleAddCommentWrapper}
                disabled={!newComment.trim()}
                className="justify-center"
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={newComment.trim() ? "#34C759" : "#A9A9A9"} 
                />
              </TouchableOpacity>
            )}
          />
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
          <StyledText category="h6" className="mb-2">Edit Listing</StyledText>
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
          <StyledLayout className="flex-row justify-between mt-2">
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
              onPress={async () => {
                await handleEditListing(id, editedContent, editedPrice);
                setEditModalVisible(false);
              }}
              status="success"
              appearance="ghost"
              size="small"
              className="rounded-full"
            >
              Finish Editing
            </StyledButton>
          </StyledLayout>
        </StyledLayout>
      </Modal>

      {/* Delete Listing Confirmation Modal */}
      <Modal
        visible={confirmDeleteVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setConfirmDeleteVisible(false)}
        style={{ width: 300, height: 250, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText>Are you sure you want to delete this listing?</StyledText>
          <StyledLayout className="flex-row justify-between mt-4">
            <StyledButton
              appearance="ghost"
              status="info"
              size="small"
              onPress={() => setConfirmDeleteVisible(false)}
              className="m-1 rounded-full"
            >
              Cancel
            </StyledButton>
            <StyledButton
              appearance="ghost"
              status="danger"
              className="m-1 rounded-full"
              size="small"
              onPress={async () => {
                await handleDeleteListing(id);
                setConfirmDeleteVisible(false);
              }}
            >
              Delete
            </StyledButton>
          </StyledLayout>
        </StyledLayout>
      </Modal>

      {/* Comment Deletion Confirmation Modal */}
      <Modal
        visible={confirmCommentDeleteVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setConfirmCommentDeleteVisible(false)}
        style={{ width: 300, height: 250, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText>Are you sure you want to delete this comment?</StyledText>
          <StyledLayout className="flex-row justify-between mt-4">
            <StyledButton
              appearance="ghost"
              status="info"
              size="small"
              className="m-1 rounded-full"
              onPress={() => setConfirmCommentDeleteVisible(false)}
            >
              Cancel
            </StyledButton>
            <StyledButton
              appearance="ghost"
              status="danger"
              size="small"
              className="m-1 rounded-full"
              onPress={handleDeleteCommentWrapper}
            >
              Delete
            </StyledButton>
          </StyledLayout>
        </StyledLayout>
      </Modal>
    </StyledCard>
  );
};

export default ListingCard;