import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Text, Layout, Input, Button, Modal, Popover } from '@ui-kitten/components';
import { styled } from 'nativewind';
import { formatTimeAgo, fetchUserInfo, handleAddComment, handleDeleteComment, confirmDeletePost } from '@/app/utils/communityUtils';
import { Timestamp } from '@react-native-firebase/firestore';

const StyledCard = styled(Card);
const StyledText = styled(Text);
const StyledLayout = styled(Layout);
const StyledInput = styled(Input);
const StyledButton = styled(Button);

interface Comment {
  id: string;
  content: string;
  userName: string;
  timestamp: Timestamp;
}

interface PostCardProps {
  id: string;
  content: string;
  userName: string;
  timestamp: Timestamp;
  onEdit: (content: string) => void;
  onDelete: (id: string) => void;
  comments?: Comment[];
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  content,
  userName,
  timestamp,
  onEdit,
  onDelete,
  comments = [],
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [confirmCommentDeleteVisible, setConfirmCommentDeleteVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [postPopoverVisible, setPostPopoverVisible] = useState(false);
  const [commentPopoverVisible, setCommentPopoverVisible] = useState<string | null>(null); // Track popover for comments

  const formattedTimestamp = formatTimeAgo(timestamp);

  useEffect(() => {
    fetchUserInfo(setUsername, setUid);
  }, []);

  const togglePostPopover = () => setPostPopoverVisible(!postPopoverVisible);
  
  const toggleCommentPopover = (commentId: string) => {
    setCommentPopoverVisible(commentPopoverVisible === commentId ? null : commentId); // Toggle popover for specific comment
  };

  return (
    <StyledLayout className="p-1 m-2 rounded-lg border border-gray-200">
      <StyledLayout className="flex-row justify-between">
        <StyledLayout>
          <StyledText category="s1" className="mt-2 ml-2 font-bold">@{userName}</StyledText>
          <StyledText category="c1" className="ml-2 text-gray-500">{formattedTimestamp}</StyledText>
        </StyledLayout>

        <StyledLayout className='m-1 p-1'>
        <Popover
          visible={postPopoverVisible}
          placement="bottom end"
          anchor={() => (
            <TouchableOpacity onPress={togglePostPopover}>
              <Ionicons name="ellipsis-vertical" size={15} color="#A9A9A9"/>
            </TouchableOpacity>
          )}
          onBackdropPress={togglePostPopover}
        >
          <StyledLayout className="p-1 rounded-lg">
            <StyledButton
              size="small"
              className="font-bold"
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
              className="font-bold"
              appearance="ghost"
              status="danger"
              onPress={() => {
                setConfirmDeleteVisible(true);
                setPostPopoverVisible(false);
              }}
            >
              Delete
            </StyledButton>
          </StyledLayout>
        </Popover>
        </StyledLayout>

      </StyledLayout>

      <StyledLayout className="mt-2 ml-2">
        <StyledText category="p1">{content}</StyledText>
      </StyledLayout>

      {/* Comment Button */}
      <StyledButton
        appearance='ghost'
        status='basic'
        size='small'
        onPress={() => setCommentModalVisible(true)}
        className="mt-2 mb-2 items-center rounded-full flex-row">
        <StyledText>Comments</StyledText>
      </StyledButton>

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setCommentModalVisible(false)}
        style={{ width: 300, height: 250, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText category="h6" className="font-bold mb-2">Comments</StyledText>
          {comments.length > 0 ? (
            comments
              .slice()
              .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())
              .map((comment) => (
                <View key={comment.id} className="pb-2 mb-2">
                  <StyledLayout className='flex-row justify-between'>
                    <StyledText className="font-bold">@{comment.userName}</StyledText>
                    {/* for comment actions */}
                    <Popover
                      visible={commentPopoverVisible === comment.id}
                      placement="bottom end"
                      anchor={() => (
                        <TouchableOpacity onPress={() => toggleCommentPopover(comment.id)}>
                          <Ionicons name="ellipsis-vertical" size={15} color="#A9A9A9" />
                        </TouchableOpacity>
                      )}
                      onBackdropPress={() => setCommentPopoverVisible(null)}
                    >
                      <StyledLayout className="p-2 rounded-lg">
                        <StyledButton
                          size="small"
                          className="font-bold"
                          appearance="ghost"
                          status="danger"
                          onPress={() => {
                            setCommentToDelete(comment);
                            setConfirmCommentDeleteVisible(true);
                            setCommentPopoverVisible(null);
                          }}
                        >
                          Delete Comment
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
          <StyledInput
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            className="rounded-lg m-1"
            accessoryRight={() => (
              <TouchableOpacity
                onPress={() => handleAddComment(newComment, id, username, uid, setNewComment)}
                disabled={!newComment.trim()}
              >
                <Ionicons name="send" size={20} color={newComment.trim() ? "#34C759" : "#A9A9A9"} />
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

      {/* Confirm Delete Post */}
      <Modal
        visible={confirmDeleteVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setConfirmDeleteVisible(false)}
        style={{ width: 300, height: 150, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText category="h6" className="font-bold mb-3">
            Are you sure you want to delete this post?
          </StyledText>
          <StyledLayout className="flex-row justify-between">
            <StyledButton
              appearance="ghost"
              status="danger"
              size="small"
              onPress={() => setConfirmDeleteVisible(false)}
            >
              Cancel
            </StyledButton>
            <StyledButton
              appearance="ghost"
              status="success"
              size="small"
              onPress={() => {
                onDelete(id);
                setConfirmDeleteVisible(false);
              }}
            >
              Delete
            </StyledButton>
          </StyledLayout>
        </StyledLayout>
      </Modal>

      {/* Confirm Comment Delete */}
      <Modal
        visible={confirmCommentDeleteVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setConfirmCommentDeleteVisible(false)}
        style={{ width: 300, height: 150, alignSelf: 'center', justifyContent: 'center' }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText category="h6" className="font-bold mb-3">
            Are you sure you want to delete this comment?
          </StyledText>
          <StyledLayout className="flex-row justify-between">
            <StyledButton
              appearance="ghost"
              status="danger"
              size="small"
              onPress={() => setConfirmCommentDeleteVisible(false)}
            >
              Cancel
            </StyledButton>
            <StyledButton
              appearance="ghost"
              status="success"
              size="small"
              onPress={() => {
                if (commentToDelete) {
                  handleDeleteComment(commentToDelete.id);
                }
                setConfirmCommentDeleteVisible(false);
              }}
            >
              Delete
            </StyledButton>
          </StyledLayout>
        </StyledLayout>
      </Modal>
    </StyledLayout>
  );
};

export default PostCard;