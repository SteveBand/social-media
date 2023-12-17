"use client";

import { BsHeartFill } from "react-icons/bs";

import { useSession } from "next-auth/react";
import { Post } from "../../../types";
import { useEffect, useState } from "react";

type Props = {
  post: Post;
};

export function PostLike({ post }: Props) {
  const [isLiked, setIsLiked] = useState({
    liked: post.liked,
    likesCount: post.numberOfLikes,
  });
  async function handleLike(post: Post) {
    if (isLiked.liked === true) {
      try {
        const res = await fetch("http://localhost:4000/delete/like", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parentId: post._id,
          }),
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
          body: JSON.stringify({
            parentId: post._id,
          }),
        });
        if (res.ok) {
          setIsLiked((prev) => ({
            liked: true,
            likesCount: prev.likesCount + 1,
          }));
          console.log(isLiked);
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
          isLiked.liked === true ? "-active" : null
        } action-button-icon `}
      />
      {isLiked.likesCount > 0 && <p>{isLiked.likesCount}</p>}
    </div>
  );
}
