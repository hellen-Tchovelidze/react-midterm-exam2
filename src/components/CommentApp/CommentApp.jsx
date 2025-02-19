import React, { useState, useEffect } from "react";
import profil from "../../assets/Images/profil.png";
import system from "../../assets/Images/sysytem.png";
import Comment from "../Comment/Comment";
import CommentForm from "../CommentForm/CommentForm";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";
import "../../App.css"

const CommentApp = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyInput, setReplyInput] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editInput, setEditInput] = useState({});
  const [editReplyMode, setEditReplyMode] = useState({});
  const [editReplyInput, setEditReplyInput] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState({});

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem("comments")) || [];
    setComments(storedComments);
  }, []);

  const saveToLocalStorage = (updatedComments) => {
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const addComment = () => {
    if (newComment.trim()) {
      const newComments = [
        ...comments,
        {
          id: Date.now(),
          text: newComment,
          author: "ელენე ჭოველიძე",
          avatar: system,
          replies: [],
          createdAt: Date.now(),
          likes: 0,
          dislikes: 0,
        },
      ];
      setComments(newComments);
      saveToLocalStorage(newComments);
      setNewComment("");
    }
  };

  const handleDelete = (id, type, replyId = null) => {
    setConfirmDelete({ id, type, replyId });
  };

  const confirmDeleteAction = () => {
    let updatedComments = [];

    if (confirmDelete.type === "comment") {
      updatedComments = comments.filter(
        (comment) => comment.id !== confirmDelete.id
      );
    } else if (confirmDelete.type === "reply") {
      updatedComments = comments.map((comment) =>
        comment.id === confirmDelete.id
          ? {
              ...comment,
              replies: comment.replies.filter(
                (reply) => reply.id !== confirmDelete.replyId
              ),
            }
          : comment
      );
    }

    setComments(updatedComments);
    saveToLocalStorage(updatedComments);
    setConfirmDelete(null);
  };

  const cancelDeleteAction = () => {
    setConfirmDelete(null);
  };

  const startEditComment = (id, text) => {
    setEditMode({ ...editMode, [id]: true });
    setEditInput({ ...editInput, [id]: text });
  };

  const saveEditComment = (commentId, text) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, text: text } : comment
    );
    setComments(updatedComments);
    saveToLocalStorage(updatedComments);
    setEditMode({ ...editMode, [commentId]: false });
  };

  const addReply = (commentId) => {
    if (replyInput[commentId]?.trim()) {
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  text: replyInput[commentId],
                  id: Date.now(),
                  author: "Chati Chati",
                  avatar: system,
                  createdAt: Date.now(),
                  likes: 0,
                  dislikes: 0,
                },
              ],
            }
          : comment
      );
      setComments(updatedComments);
      saveToLocalStorage(updatedComments);
      setReplyInput({ ...replyInput, [commentId]: "" });
      setShowReplyInput({ ...showReplyInput, [commentId]: false });
    }
  };

  const startEditReply = (commentId, replyId, text) => {
    setEditReplyMode({ ...editReplyMode, [replyId]: true });
    setEditReplyInput({ ...editReplyInput, [replyId]: text });
  };

  const saveEditReply = (commentId, replyId) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === replyId
                ? { ...reply, text: editReplyInput[replyId] }
                : reply
            ),
          }
        : comment
    );
    setComments(updatedComments);
    saveToLocalStorage(updatedComments);
    setEditReplyMode({ ...editReplyMode, [replyId]: false });
  };

  const handleLike = (commentId, isReply = false, replyId = null) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? isReply
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              ),
            }
          : { ...comment, likes: comment.likes + 1 }
        : comment
    );
    setComments(updatedComments);
    saveToLocalStorage(updatedComments);
  };

  const handleDislike = (commentId, isReply = false, replyId = null) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? isReply
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId
                  ? { ...reply, dislikes: reply.dislikes + 1 }
                  : reply
              ),
            }
          : { ...comment, dislikes: comment.dislikes + 1 }
        : comment
    );
    setComments(updatedComments);
    saveToLocalStorage(updatedComments);
  };

  const toggleReplyInput = (commentId) => {
    setShowReplyInput({
      ...showReplyInput,
      [commentId]: !showReplyInput[commentId],
    });
  };

  return (
    <div className="flex justify-center items-center flex-col-reverse h-full">
      <CommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
      />

      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          editMode={editMode}
          editInput={editInput}
          startEditComment={startEditComment}
          saveEditComment={saveEditComment}
          handleDelete={handleDelete}
          toggleReplyInput={toggleReplyInput}
          handleLike={handleLike}
          handleDislike={handleDislike}
          showReplyInput={showReplyInput}
          replyInput={replyInput}
          setReplyInput={setReplyInput}
          addReply={addReply}
          editReplyMode={editReplyMode}
          editReplyInput={editReplyInput}
          startEditReply={startEditReply}
          saveEditReply={saveEditReply}
        />
      ))}

      {confirmDelete && (
        <DeleteConfirmation
          confirmDelete={confirmDelete}
          confirmDeleteAction={confirmDeleteAction}
          cancelDeleteAction={cancelDeleteAction}
        />
      )}
    </div>
  );
};

export default CommentApp;
