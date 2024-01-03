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

  const fetchUrl = post.isPost
    ? "http://localhost:4000/new/post/like"
    : post.isComment
    ? "http://localhost:4000/new/comment/like"
    : "";

  async function handleLike(post: PostType) {
    if (isLiked.liked === true) {
      try {
        const res = await fetch("http://localhost:4000/delete/post/like", {
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
        const res = await fetch(fetchUrl, {
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
      <p>{isLiked.likesCount > 0 && isLiked.likesCount}</p>
    </div>
  );
}
