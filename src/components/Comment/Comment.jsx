
import React, { useState, useEffect } from "react";
import Count from "../count/count";
import "./com.css"
const Comment = ({
  comment,
  editMode,
  editInput,
  startEditComment,
  saveEditComment,
  handleDelete,
  toggleReplyInput,
  handleLike,
  handleDislike,
  showReplyInput,
  replyInput,
  setReplyInput,
  addReply,
  editReplyMode,
  editReplyInput,
  startEditReply,
  saveEditReply,
}) => {
  const [localEditInput, setLocalEditInput] = useState(editInput[comment.id] || "");
  const [replies, setReplies] = useState(JSON.parse(localStorage.getItem(`replies_${comment.id}`)) || []);
  const [localReplyInput, setLocalReplyInput] = useState(replyInput[comment.id] || "");
  const [editReplyInputState, setEditReplyInputState] = useState({});

  useEffect(() => {
    setLocalReplyInput(replyInput[comment.id] || "");
  }, [replyInput, comment.id]);

  const handleEditInputChange = (e) => setLocalEditInput(e.target.value);

  const handleSaveComment = (commentId) => {
    saveEditComment(commentId, localEditInput);
    setLocalEditInput(""); 
  };

  const handleAddReply = () => {
    if (localReplyInput.trim() !== "") {
      const newReply = { text: localReplyInput, id: Date.now(), likes: 0, dislikes: 0, author: comment.author, avatar: comment.avatar };
      const updatedReplies = [...replies, newReply];
      setReplies(updatedReplies);
      localStorage.setItem(`replies_${comment.id}`, JSON.stringify(updatedReplies));


      setLocalReplyInput(""); 
      setReplyInput({ ...replyInput, [comment.id]: "" }); 
    }
  };

  const handleDeleteReply = (replyId) => {
    const updatedReplies = replies.filter(reply => reply.id !== replyId);
    setReplies(updatedReplies);
    localStorage.setItem(`replies_${comment.id}`, JSON.stringify(updatedReplies));
  };

  const handleLikeReply = (replyId) => {
    const updatedReplies = replies.map((reply) =>
      reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
    );
    setReplies(updatedReplies);
    localStorage.setItem(`replies_${comment.id}`, JSON.stringify(updatedReplies));
  };

  const handleDislikeReply = (replyId) => {
    const updatedReplies = replies.map((reply) =>
      reply.id === replyId ? { ...reply, dislikes: reply.dislikes + 1 } : reply
    );
    setReplies(updatedReplies);
    localStorage.setItem(`replies_${comment.id}`, JSON.stringify(updatedReplies));
  };

  const handleReplyInputChange = (e) => setLocalReplyInput(e.target.value);

  const handleSaveReply = (replyId) => {
    const updatedReplies = replies.map((reply) =>
      reply.id === replyId ? { ...reply, text: editReplyInputState[replyId] || reply.text } : reply
    );
    setReplies(updatedReplies);
    localStorage.setItem(`replies_${comment.id}`, JSON.stringify(updatedReplies));
    setEditReplyInputState({ ...editReplyInputState, [replyId]: "" });
  };

  const handleEditReplyChange = (e, replyId) => {
    setEditReplyInputState({ ...editReplyInputState, [replyId]: e.target.value });
  };

  const formatTimeAgo = (timestamp) => {
    const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
  
    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return "Just now";
  };
  

  return (
    <div className="mt-4 space-y-4 justify-start  p-7">
      
      <div className="p-4 bg-white border-2 border-[#E9EBF0] rounded-xl shadow w-[730px] flex items-start  conteinerdiv ">
        <div className="mr-4">
          <Count />
        </div>
        <div className="flex flex-col w-full ">
          <div className="flex justify-between items-start w-full headerdiv">
            <div className="flex items-center gap-2">
              <img
                src={comment.avatar}
                alt="a"
                className="max-w-10  w-full h-10  rounded-full"
              />
              <p className="text-lg font-bold text-[#334253]">
                {comment.author}
                <span className="text-sm text-gray-500">
    ({formatTimeAgo(comment.createdAt)})
  </span>
              </p>
            </div>
            <div className="flex gap-2">
              {editMode[comment.id] ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localEditInput}
                    onChange={handleEditInputChange}
                    className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => handleSaveComment(comment.id)}
                    className="text-[16px] flex justify-center items-center max-w-[104px] w-[100%] h-[48px] bg-[#5357B6] rounded-lg text-[#FFFFFF] hover:bg-blue-500 cursor-pointer"
                  >
                    UPDATE
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditComment(comment.id, comment.text)}
                    className="text-[#5357B6] hover:text-[#262750] cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id, "comment")}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleReplyInput(comment.id)}
                    className="text-[#5357B6] hover:text-blue-700 cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-start mt-2">
            {!editMode[comment.id] && comment.text}
          </p>
          <div className="flex gap-4 mt-2 justify-start">
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
      </div>

     
      {showReplyInput[comment.id] && (
        <div className="mt-2 flex gap-4 justify-center bg-white h-[144px] w-[730px]  items-center rounded-lg cont">
          <textarea
            value={localReplyInput}
            onChange={handleReplyInputChange}
            placeholder="Write a reply..."
            className="w-full max-w-[506px] h-[96px] border-2 border-[#E9EBF0] focus:border-[#5357B6] focus:outline-none rounded-lg p-2 inpre"
          />
          <button
            onClick={handleAddReply}
            className="px-4 py-2 bg-[#5357B6] text-white hover:bg-blue-600 w-[104px] h-[48px] flex justify-center items-center rounded-lg"
          >
            Reply
          </button>
        </div>
      )}

    
      <div className="mt-4 space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="p-4 bg-white border-2 border-[#E9EBF0] rounded-xl shadow w-[600px] flex items-start ml-auto conteinerreply">
            <div className="mr-4">
              <Count />
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-start w-full headerdiv">
                <div className="flex items-center gap-2">
                  <img
                    src={reply.avatar}
                    alt="a"
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="text-lg font-bold text-[#334253]">
                    {reply.author}
                    <span className="text-sm text-gray-500">
    ({formatTimeAgo(reply.createdAt)})
  </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {editReplyMode[reply.id] ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editReplyInputState[reply.id] || reply.text}
                        onChange={(e) => handleEditReplyChange(e, reply.id)}
                        className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        onClick={() => handleSaveReply(reply.id)}
                        className="text-[16px] flex justify-center items-center w-[104px] h-[48px] bg-[#5357B6] rounded-lg text-[#FFFFFF] hover:bg-blue-500 cursor-pointer"
                      >
                        UPDATE
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditReply(reply.id, reply.text)}
                        className="text-[#5357B6] hover:text-[#262750] cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReply(reply.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Delete
                      </button>

                      <button
                    onClick={() => toggleReplyInput(comment.id)}
                    className="text-[#5357B6] hover:text-blue-700 cursor-pointer"
                  >
                    Reply
                  </button>

                    </div>
                  )}
                </div>
              </div>
              <p className="text-start mt-2">
                {!editReplyMode[reply.id] && reply.text}
              </p>
              <div className="flex gap-4 mt-2 justify-start">
                <button
                  onClick={() => handleLikeReply(reply.id)}
                  className="text-green-500"
                >
                  👍 {reply.likes}
                </button>
                <button
                  onClick={() => handleDislikeReply(reply.id)}
                  className="text-red-500"
                >
                  👎 {reply.dislikes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
