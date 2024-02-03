import React, { SetStateAction } from "react";
import { PiUserCircle } from "react-icons/pi";

export default function PostInput({
  setModal,
}: {
  setModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="feed-post-input-container" onClick={() => setModal(true)}>
      <PiUserCircle className="feed-post-input-icon" />
      <p className="feed-post-input">Start a post...</p>
      <button className="feed-post-input-button">Post</button>
    </div>
  );
}
