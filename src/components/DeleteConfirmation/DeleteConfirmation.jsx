import React, { useEffect, useRef } from "react";

const DeleteConfirmation = ({
  confirmDelete,
  confirmDeleteAction,
  cancelDeleteAction,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        cancelDeleteAction();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [cancelDeleteAction]);

  return (
    <div className="fixed inset-0  bg-black/50 flex justify-center items-center">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-lg font-bold">Delete comment</h1>
        <p className="mt-2">
          Are you sure you want to delete this <br />
          comment? This will remove the comment <br />
          and can’t be undone.
        </p>
        <div className="flex justify-center flex-row-reverse gap-2 mt-4">
          <button
            onClick={confirmDeleteAction}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          >
            YES, DELETE
          </button>
          <button
            onClick={cancelDeleteAction}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
          >
            NO, CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
