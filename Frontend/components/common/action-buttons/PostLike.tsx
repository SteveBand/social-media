"use client";

import { BsHeartFill } from "react-icons/bs";
import { PostType } from "../../../../types";
import { SetStateAction, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { NotLoggedModal } from "../notLoggedModal/NotLoggedModal";
import { activate } from "@/redux/features/loginModal-slice";

export function PostLike({ post, setPosts, handlePostLikeFunction }: Props) {
  const [isLiked, setIsLiked] = useState({
    liked: post.liked,
    likesCount: post.likesCount,
  });

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer);
  const loginModal = useAppSelector((state) => state.loginReducer.isModal);

  const fetchUrl = `http://localhost:4000/${isLiked.liked ? "delete" : "new"}/${
    post.isPost ? "post" : "comment"
  }/like?postId=${post._id}&author=${
    post.isPost ? post.parentId : post.userId
  }`;

  async function handleLike(post: PostType) {
    if (user.status === "authenticated") {
      try {
        const res = await fetch(fetchUrl, {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          setIsLiked((prev) => ({
            liked: !isLiked.liked,
            likesCount: prev.liked ? prev.likesCount - 1 : prev.likesCount + 1,
          }));
          handlePostLikeFunction && handlePostLikeFunction(post._id, isLiked);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      dispatch(activate());
    }
  }

  return (
    <>
      <div className="button-container" onClick={() => handleLike(post)}>
        <BsHeartFill
          className={`post-like-button${
            isLiked.liked === true ? "-active" : ""
          } action-button-icon `}
        />
        <p>{isLiked.likesCount > 0 && isLiked.likesCount}</p>
      </div>
    </>
  );
}

type Props = {
  post: PostType;
  setPosts?: React.Dispatch<SetStateAction<PostType[]>>;
  handlePostLikeFunction?: (
    postId: string,
    isLiked: { liked: boolean; likesCount: number }
  ) => void;
};
