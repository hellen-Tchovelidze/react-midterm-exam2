import React, { useState, useEffect } from "react";

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
          replies: [],
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

  const saveEditComment = (id) => {
    const updatedComments = comments.map((comment) =>
      comment.id === id ? { ...comment, text: editInput[id] } : comment
    );
    setComments(updatedComments);
    saveToLocalStorage(updatedComments);
    setEditMode({ ...editMode, [id]: false });
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
      <div className="flex justify-center items-center bg-white w-[730px] h-36 max-h-full cursor-pointer rounded-lg gap-1.5">
        <textarea
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full max-w-[506px] h-[96px] border-2 border-[#E9EBF0] focus:border-[#5357B6] focus:outline-none rounded-lg p-2"
        ></textarea>
        <button
          onClick={addComment}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Comment
        </button>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className="mt-4 space-y-4">
         
          <div className="p-4 bg-white border-2 border-[#E9EBF0] rounded-xl shadow">
            <div className="flex justify-between items-start">
            
              <div className="flex flex-col">
                <p className="text-lg font-bold text-green-500">
                  {comment.author}
                </p>
              </div>

              {/* editebi */}
              <div className="flex gap-2">
                {editMode[comment.id] ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editInput[comment.id] || ""}
                      onChange={(e) =>
                        setEditInput({
                          ...editInput,
                          [comment.id]: e.target.value,
                        })
                      }
                      className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={() => saveEditComment(comment.id)}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditComment(comment.id, comment.text)}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id, "comment")}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleReplyInput(comment.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* comentarebis teqstebi */}
            {!editMode[comment.id] && (
              <p className="text-center mt-2">{comment.text}</p>
            )}

            <div className="flex gap-4 mt-2 justify-center">
              <button
                onClick={() => handleLike(comment.id)}
                className="text-green-500"
              >
                👍 {comment.likes}
              </button>
              <button
                onClick={() => handleDislike(comment.id)}
                className="text-red-500"
              >
                👎 {comment.dislikes}
              </button>
            </div>
          </div>

         {/* repleis inputebi */}
          {showReplyInput[comment.id] && (
            <div className="mt-2 flex gap-4 justify-center">
              <textarea
                value={replyInput[comment.id] || ""}
                onChange={(e) =>
                  setReplyInput({ ...replyInput, [comment.id]: e.target.value })
                }
                placeholder="Write a reply..."
                className="w-full max-w-[506px] h-[40px] border-2 border-[#E9EBF0] focus:border-[#5357B6] focus:outline-none rounded-lg p-2"
              />
              <button
                onClick={() => addReply(comment.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Reply
              </button>
            </div>
          )}

          {/* Replies */}
          <div className="ml-6">
            {comment.replies.map((reply) => (
              <div
                key={reply.id}
                className="p-2 bg-blue-500 text-white border-2 border-white rounded-lg shadow-md mb-2"
              >
                {editReplyMode[reply.id] ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editReplyInput[reply.id] || ""}
                      onChange={(e) =>
                        setEditReplyInput({
                          ...editReplyInput,
                          [reply.id]: e.target.value,
                        })
                      }
                      className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={() => saveEditReply(comment.id, reply.id)}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <p>{reply.text}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          startEditReply(comment.id, reply.id, reply.text)
                        }
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(comment.id, "reply", reply.id)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-2 justify-center">
                  <button
                    onClick={() => handleLike(comment.id, true, reply.id)}
                    className="text-green-500"
                  >
                    👍 {reply.likes}
                  </button>
                  <button
                    onClick={() => handleDislike(comment.id, true, reply.id)}
                    className="text-red-500"
                  >
                    👎 {reply.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <p>Are you sure you want to delete this {confirmDelete.type}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={confirmDeleteAction}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={cancelDeleteAction}
                className="px-3 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentApp;
