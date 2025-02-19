import React from "react";
import system from "../../assets/Images/sysytem.png"
const CommentForm = ({ newComment, setNewComment, addComment }) => {
  return (
    <div className="flex justify-center items-center bg-white w-[730px]  h-36  cursor-pointer rounded-lg gap-1.5">
        <div><img src={system} alt="" /></div>
      <textarea
        type="text"
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-[506px] h-[96px] border-2 border-[#E9EBF0] focus:border-[#5357B6] focus:outline-none rounded-lg p-2"
      ></textarea>
      <button
        onClick={addComment}
        className="px-4 py-2 text-white rounded-lg bg-[#5357B6] h-[48px] w-32 hover:bg-blue-500 cursor-pointer"
      >
        SEND
      </button>
    </div>
  );
};

export default CommentForm;