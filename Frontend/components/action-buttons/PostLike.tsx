"use client";

import { BsHeartFill } from "react-icons/bs";
import { PostType } from "../../../types";
import { useState } from "react";

type Props = {
  post: PostType;
  posts?: PostType[];
};

export function PostLike({ post, posts }: Props) {
  const [isLiked, setIsLiked] = useState({
    liked: post.liked,
    likesCount: post.likesCount,
  });

  const fetchUrl = `http://localhost:4000/${isLiked.liked ? "delete" : "new"}/${
    post.isPost ? "post" : "comment"
  }/like`;

  async function handleLike(post: PostType) {
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
          liked: false,
          likesCount: prev.likesCount - 1,
        }));
      }
    } catch (err) {
      console.log(err);
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
