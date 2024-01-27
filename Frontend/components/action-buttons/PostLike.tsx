"use client";

import { BsHeartFill } from "react-icons/bs";
import { PostType } from "../../../types";
import { SetStateAction, useState } from "react";

export function PostLike({ post, setPosts }: Props) {
  const [isLiked, setIsLiked] = useState({
    liked: post.liked,
    likesCount: post.likesCount,
  });

  const fetchUrl = `http://localhost:4000/${isLiked.liked ? "delete" : "new"}/${
    post.isPost ? "post" : "comment"
  }/like`;

  const testPost = {
    // _id: "65a52d36a1bae895ee16f2e6",
    content: "Test 1",
    parentId: "denis@gmail.com",
    date: "January 15th 2024, 3:03:50 pm",
    likesCount: 1,
    commentsCount: 0,
    sharesCount: 0,
    isPost: true,
    createdAt: {
      $date: "2024-01-15T13:03:50.452Z",
    },
    updatedAt: {
      $date: "2024-01-15T13:06:10.817Z",
    },
    __v: 1,
  };

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
          liked: !isLiked.liked,
          likesCount: prev.liked ? prev.likesCount - 1 : prev.likesCount + 1,
        }));
        setPosts &&
          setPosts((prev) => {
            return prev.map((el) => {
              if (el._id === post._id) {
                return {
                  ...el,
                  liked: !el.liked,
                  likesCount: el.liked ? el.likesCount - 1 : el.likesCount + 1,
                };
              }
              return el;
            });
          });
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

type Props = {
  post: PostType;
  setPosts?: React.Dispatch<SetStateAction<PostType[]>>;
};
