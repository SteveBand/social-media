import { IoIosShareAlt } from "react-icons/io";
import { PostType } from "../../../../../../types";
import { SlOptions } from "react-icons/sl";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { PostLike } from "@/components/action-buttons/PostLike";
import { ProfileImage } from "@/components/ProfileImage";
import { CommentButton } from "@/components/action-buttons/CommentButton";

type Props = {
  comment: PostType;
  handlePostLikeFunction?: (
    postId: string,
    isLiked: { liked: boolean; likesCount: number }
  ) => void;
  setComments: React.Dispatch<SetStateAction<PostType[]>>;
};

export function Comment({
  comment,
  handlePostLikeFunction,
  setComments,
}: Props) {
  const router = useRouter();
  if (!comment || comment === undefined) {
    return <div>No Comments</div>;
  }

  function handleNavigation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    const attribute = target.getAttribute("data-navigate-to");
    if (!attribute) {
      return;
    } else {
      console.log(router.push(attribute));
    }
  }

  return (
    <article
      key={comment._id}
      className="comment-wrapper"
      onClick={handleNavigation}
    >
      <div
        className="comment-container"
        data-navigate-to={`/comment/${comment._id}?postId=${comment._id}`}
      >
        <ProfileImage userInfo={comment.user_info} />
        <div
          className="content"
          data-navigate-to={`/comment/${comment._id}?postId=${comment._id}`}
        >
          <p>{comment.user_info.name}</p>
          <p data-navigate-to={`/comment/${comment._id}?postId=${comment._id}`}>
            {comment.content}
          </p>
        </div>
        <SlOptions className="options-btn" />
      </div>
      <footer
        data-navigate-to={`/comment/${comment._id}?postId=${comment._id}`}
      >
        <PostLike
          post={comment}
          handlePostLikeFunction={handlePostLikeFunction}
        />
        <div className="button-container" id="">
          <CommentButton
            content={comment}
            setComments={setComments}
          />
        </div>
        <div className="button-container">
          <IoIosShareAlt className="icon" />
          <p>{comment.sharesCount > 0 && comment.sharesCount}</p>
        </div>
      </footer>
    </article>
  );
}
