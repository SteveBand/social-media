import { useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import { CommunityPostType } from "../../../types";

export function CommunityPostLike({ post }: { post: CommunityPostType }) {
  const [isLiked, setIsLiked] = useState({
    liked: post.isLiked,
    likesCount: post.likesCount,
  });

  async function handleLike(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:4000/community/post/${post._id}/${
        isLiked.liked ? "remove" : "new"
      }/like?communityId=${post.communityId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (res.ok) {
      setIsLiked((prev) => {
        return {
          liked: !prev.liked,
          likesCount: !isLiked.liked
            ? prev.likesCount + 1
            : prev.likesCount - 1,
        };
      });
    }
  }

  return (
    <div className="button-container" onClick={handleLike}>
      <BsHeartFill
        className={`post-like-button${
          isLiked.liked === true ? "-active" : ""
        } action-button-icon `}
      />
      <p>{isLiked.likesCount > 0 && isLiked.likesCount}</p>
    </div>
  );
}
