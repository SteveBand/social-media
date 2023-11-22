import React, { Dispatch, SetStateAction } from "react";
import { PiUserCircle } from "react-icons/pi";
type Props = {
  setModal: Dispatch<SetStateAction<boolean>>;
};

export default function PostInput({ setModal }: Props) {
  return (
    <div className="feed-post-input-container">
      <PiUserCircle className="feed-post-input-icon" />
      <p className="feed-post-input" onClick={() => setModal(true)}>
        Start a post...
      </p>
      <button className="feed-post-input-button">Post</button>
    </div>
  );
}
