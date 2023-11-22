import React from "react";
import { PiUserCircle } from "react-icons/pi";
type Props = {};

export default function PostInput({}: Props) {
  return (
    <div className="feed-post-input-container">
      <PiUserCircle className="feed-post-input-icon" />
      <p className="feed-post-input">Start a post...</p>
      <button className="feed-post-input-button">Post</button>
    </div>
  );
}
