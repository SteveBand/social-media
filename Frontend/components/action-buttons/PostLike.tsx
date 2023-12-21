"use client";

import { BsHeartFill } from "react-icons/bs";
import { PostType } from "../../../types";
import { useState } from "react";

type Props = {
  post: PostType;
};

export function PostLike({ post }: Props) {
  const [isLiked, setIsLiked] = useState({
    liked: post.liked,
    likesCount: post.likesCount,
  });
  async function handleLike(post: PostType) {
    if (isLiked.liked === true) {
      try {
        const res = await fetch("http://localhost:4000/delete/like", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        });
        if (res.ok) {
          setIsLiked((prev) => ({
            liked: false,
            likesCount: prev.likesCount - 1,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (isLiked.liked === false) {
      try {
        const res = await fetch("http://localhost:4000/new/like", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        });
        if (res.ok) {
          setIsLiked((prev) => ({
            liked: true,
            likesCount: prev.likesCount + 1,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="button-container" onClick={() => handleLike(post)}>
      <BsHeartFill
        className={`post-like-button${
          isLiked.liked === true ? "-active" : ""
        } action-button-icon `}
      />
      {isLiked.likesCount > 0 && <p>{isLiked.likesCount}</p>}
    </div>
  );
}
