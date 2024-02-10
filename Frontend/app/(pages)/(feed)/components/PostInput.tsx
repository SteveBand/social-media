"use client";

import { useAppSelector, useAppDispatch } from "@/hooks";
import { activate } from "@/redux/features/loginModal-slice";
import React, { SetStateAction } from "react";
import { PiUserCircle } from "react-icons/pi";

export default function PostInput({
  setModal,
}: {
  setModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const user = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();

  const image = user.user_info.avatar_url ? (
    <img src={user.user_info.avatar_url} className="feed-post-input-image" />
  ) : (
    <PiUserCircle className="feed-post-input-icon" />
  );

  function handleModal() {
    if (user.status === "authenticated") {
      setModal(true);
    } else {
      dispatch(activate());
    }
  }

  return (
    <div className="feed-post-input-container" onClick={() => handleModal()}>
      {image}
      <p className="feed-post-input">Start a post...</p>
      <button className="feed-post-input-button action-button">Post</button>
    </div>
  );
}
