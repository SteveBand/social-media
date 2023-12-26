"use client";

import { BsHeartFill } from "react-icons/bs";
import { CommentType, PostType } from "../../../types";
import { useState } from "react";

type Props = {
  comment: CommentType;
};

export function CommentLike({ comment }: Props) {
  const [isLiked, setIsLiked] = useState({
    liked: comment.liked,
    likesCount: comment.likesCount,
  });
  async function handleLike(comment: CommentType) {
    if (isLiked.liked === true) {
      try {
        const res = await fetch("http://localhost:4000/delete/comment/like", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(comment),
        });
        if (res.ok) {
          setIsLiked((prev: any) => ({
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
        const res = await fetch("http://localhost:4000/new/comment/like", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(comment),
        });
        if (res.ok) {
          setIsLiked((prev: any) => ({
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
    <div className="button-container" onClick={() => handleLike(comment)}>
      <BsHeartFill
        className={`post-like-button${
          isLiked.liked === true ? "-active" : ""
        } action-button-icon `}
      />
      <p>{isLiked.likesCount > 0 && isLiked.likesCount}</p>
    </div>
  );
}
