import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Card,
  Text,
  Layout,
  Input,
  Button,
  Modal,
  Popover,
} from "@ui-kitten/components";
import { styled } from "nativewind";
import {
  formatTimeAgo,
  fetchUserInfo,
  handleAddComment,
  handleDeleteComment,
  confirmDeletePost,
} from "@/app/utils/communityUtils";
import { Timestamp } from "@react-native-firebase/firestore";
import { myTheme } from "@/constants/custom-theme";
import { useUserContext } from "@/contexts/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  userUID: string;
  timestamp: Timestamp;
  onEdit: (content: string) => void;
  onDelete: (id: string) => void;
  comments?: Comment[];
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  content,
  userName,
  userUID,
  timestamp,
  onEdit,
  onDelete,
  comments = [],
}) => {
  const { userUid } = useUserContext();
  const [editedContent, setEditedContent] = useState(content);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [confirmCommentDeleteVisible, setConfirmCommentDeleteVisible] =
    useState(false);
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [postPopoverVisible, setPostPopoverVisible] = useState(false);
  const [commentPopoverVisible, setCommentPopoverVisible] = useState<
    string | null
  >(null); // Track popover for comments

  const formattedTimestamp = formatTimeAgo(timestamp);

  useEffect(() => {
    fetchUserInfo(setUsername, setUid);
  }, []);

  const togglePostPopover = () => setPostPopoverVisible(!postPopoverVisible);

  const toggleCommentPopover = (commentId: string) => {
    setCommentPopoverVisible(
      commentPopoverVisible === commentId ? null : commentId
    ); // Toggle popover for specific comment
  };

  return (
    <StyledLayout
      className="p-1 m-2 rounded-xl border border-gray-200"
      style={{ backgroundColor: myTheme["color-basic-200"] }}
    >
      <StyledLayout
        className="flex-row justify-between"
        style={{ backgroundColor: myTheme["color-basic-200"] }}
      >
        <StyledLayout
          style={{ backgroundColor: myTheme["color-basic-200"] }}
          className="flex-row items-center mt-3"
        >
          <StyledText className=" ml-2 font-bold text-[90px]">
            <MaterialCommunityIcons
              name="emoticon-excited"
              size={50}
              color={myTheme["color-success-700"]}
            />
          </StyledText>
          <StyledLayout
            className="flex-column"
            style={{ backgroundColor: myTheme["color-basic-200"] }}
          >
            <StyledText className=" ml-1 text-base text-gray-900 italic w-full">
              @{userName}
            </StyledText>
            <StyledText
              className="ml-2 text-[12px] text-gray-400"
              style={{ color: myTheme["color-success-900"] }}
            >
              {formattedTimestamp}
            </StyledText>
          </StyledLayout>
        </StyledLayout>

        {userUID === userUid && (
          <StyledLayout
            className="m-3 p-3"
            style={{ backgroundColor: myTheme["color-basic-200"] }}
          >
            <Popover
              visible={postPopoverVisible}
              placement="bottom end"
              anchor={() => (
                <TouchableOpacity onPress={togglePostPopover}>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={15}
                    color="#A9A9A9"
                  />
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
                  <StyledText
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 12,
                      color: myTheme["color-info-500"],
                      padding: 8,
                    }}
                  >
                    Edit
                  </StyledText>
                </StyledButton>
                <TouchableOpacity
                  onPress={() => {
                    setConfirmDeleteVisible(true);
                    setPostPopoverVisible(false);
                  }}
                >
                  <StyledText
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 12,
                      color: myTheme["color-danger-500"],
                      padding: 8,
                    }}
                  >
                    Delete
                  </StyledText>
                </TouchableOpacity>
              </StyledLayout>
            </Popover>
          </StyledLayout>
        )}
      </StyledLayout>

      <StyledLayout
        className="my-2 ml-5"
        style={{ backgroundColor: myTheme["color-basic-200"] }}
      >
        <StyledText className="text-lg">{content}</StyledText>
      </StyledLayout>
      {/* Comment Button */}
      <StyledLayout
        className="items-end mr-5"
        style={{ backgroundColor: myTheme["color-basic-200"] }}
      >
        <StyledButton
          appearance="ghost"
          onPress={() => setCommentModalVisible(true)}
          className="mt-2 mb-2 w-1/3 rounded-full flex-row"
          style={{ backgroundColor: myTheme["color-basic-300"] }}
        >
          <StyledText>Comments</StyledText>
        </StyledButton>
      </StyledLayout>

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={() => setCommentModalVisible(false)}
        style={{
          width: 300,
          height: 250,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText
            style={{
              fontFamily: "Poppins-SemiBold",
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Comments
          </StyledText>
          {comments.length > 0 ? (
            comments
              .slice()
              .sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis())
              .map((comment) => (
                <View key={comment.id} className="pb-2 mb-2">
                  <StyledLayout className="flex-row justify-between">
                    <StyledText
                      style={{ fontFamily: "Poppins-SemiBold", fontSize: 14 }}
                    >
                      @{comment.userName}
                    </StyledText>
                    {userUID === userUid && (

                    <Popover
                      visible={commentPopoverVisible === comment.id}
                      placement="bottom end"
                      anchor={() => (
                        <TouchableOpacity
                          onPress={() => toggleCommentPopover(comment.id)}
                        >
                          <Ionicons
                            name="ellipsis-vertical"
                            size={15}
                            color="#A9A9A9"
                          />
                        </TouchableOpacity>
                      )}
                      onBackdropPress={() => setCommentPopoverVisible(null)}
                    >
                      <StyledLayout className="p-2 rounded-lg">
                        <TouchableOpacity
                          onPress={() => {
                            setCommentToDelete(comment);
                            setConfirmCommentDeleteVisible(true);
                            setCommentPopoverVisible(null);
                          }}
                        >
                          <StyledText
                            style={{
                              fontFamily: "Poppins-Medium",
                              fontSize: 12,
                              color: myTheme["color-danger-500"],
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
                      fontFamily: "Poppins-Regular",
                      fontSize: 14,
                      marginLeft: 5,
                    }}
                  >
                    {comment.content}
                  </StyledText>
                  <StyledText
                    style={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 11,
                      color: "#8F9BB3",
                    }}
                  >
                    {formatTimeAgo(comment.timestamp)}
                  </StyledText>
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
            textStyle={{ fontFamily: "Poppins-Regular", fontSize: 12 }}
            accessoryRight={() => (
              <TouchableOpacity
                onPress={() =>
                  handleAddComment(newComment, id, username, uid, setNewComment)
                }
                disabled={!newComment.trim()}
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
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={() => setEditModalVisible(false)}
        style={{
          width: 300,
          height: 250,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText style={{ fontFamily: "Poppins-SemiBold", fontSize: 16 }}>
            Edit Post
          </StyledText>
          <StyledInput
            value={editedContent}
            onChangeText={setEditedContent}
            placeholder="Edit your post..."
            multiline
            className="mb-2 mt-2"
            textStyle={{ fontFamily: "Poppins-Regular", fontSize: 13, top: 2 }}
          />
          <StyledLayout className="flex-row justify-between mt-3">
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              className="m-1 rounded-full"
            >
              <StyledText
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 12,
                  color: myTheme["color-info-500"],
                  padding: 8,
                }}
              >
                Cancel
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (editedContent !== content) {
                  onEdit(editedContent);
                }
                setEditModalVisible(false);
              }}
              className="m-1 rounded-full"
            >
              <StyledText
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 12,
                  color: myTheme["color-primary-700"],
                  padding: 8,
                }}
              >
                Save Changes
              </StyledText>
            </TouchableOpacity>
          </StyledLayout>
        </StyledLayout>
      </Modal>

      {/* Confirm Delete Post */}
      <Modal
        visible={confirmDeleteVisible}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={() => setConfirmDeleteVisible(false)}
        style={{
          width: 300,
          height: 150,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText style={{ fontFamily: "Poppins-SemiBold", fontSize: 16 }}>
            Are you sure you want to delete this post?
          </StyledText>
          <StyledLayout className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setConfirmDeleteVisible(false)}
              className="m-1 p-2 rounded-full flex-row items-center justify-center"
              style={{ backgroundColor: "transparent" }}
            >
              <StyledText
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 12,
                  color: myTheme["color-info-500"],
                }}
              >
                Cancel
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onDelete(id);
                setConfirmDeleteVisible(false);
              }}
              className="m-1 p-2 rounded-full flex-row items-center justify-center"
              style={{ backgroundColor: "transparent" }}
            >
              <StyledText
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 12,
                  color: myTheme["color-danger-500"],
                }}
              >
                Delete
              </StyledText>
            </TouchableOpacity>
          </StyledLayout>
        </StyledLayout>
      </Modal>

      {/* Confirm Comment Delete */}
      <Modal
        visible={confirmCommentDeleteVisible}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onBackdropPress={() => setConfirmCommentDeleteVisible(false)}
        style={{
          width: 300,
          height: 150,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <StyledLayout className="p-5 rounded-lg">
          <StyledText style={{ fontFamily: "Poppins-SemiBold", fontSize: 16 }}>
            Are you sure you want to delete this comment?
          </StyledText>
          <StyledLayout className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => setConfirmCommentDeleteVisible(false)}
              className="m-1 p-2 rounded-full flex-row items-center justify-center"
              style={{ backgroundColor: "transparent" }}
            >
              <StyledText
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 12,
                  color: myTheme["color-info-500"],
                }}
              >
                Cancel
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (commentToDelete) {
                  handleDeleteComment(commentToDelete.id);
                }
                setConfirmCommentDeleteVisible(false);
              }}
              className="m-1 p-2 rounded-full flex-row items-center justify-center"
              style={{ backgroundColor: "transparent" }}
            >
              <StyledText
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 12,
                  color: myTheme["color-danger-500"],
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

export default PostCard;
