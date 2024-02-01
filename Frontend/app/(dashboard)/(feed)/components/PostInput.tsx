import React from "react";
import { useAppDispatch } from "@/hooks";
import { PiUserCircle } from "react-icons/pi";

export default function PostInput() {
  const dispatch = useAppDispatch();
  return (
    <div className="feed-post-input-container">
      <PiUserCircle className="feed-post-input-icon" />
      <p className="feed-post-input">Start a post...</p>
      <button className="feed-post-input-button">Post</button>
    </div>
  );
}
