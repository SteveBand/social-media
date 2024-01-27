import { IoIosShareAlt } from "react-icons/io";
import { PostType } from "../../../../../../types";
import { CommentModal } from "@/components/commentModal/CommentModal";
import { createPortal } from "react-dom";
import { IoChatboxOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostLike } from "@/components/action-buttons/PostLike";
import { ProfileImage } from "@/components/ProfileImage";

type Props = {
  comment: PostType;
  handlePostLikeFunction?: (
    postId: string,
    isLiked: { liked: boolean; likesCount: number }
  ) => void;
};

export function Comment({ comment, handlePostLikeFunction }: Props) {
  const [showComment, setShowComment] = useState(false);
  const router = useRouter();
  if (!comment || comment === undefined) {
    return <div>No Comments</div>;
  }

  const handleCommentModel = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowComment(true);
  };

  function handleNavigation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    const attribute = target.getAttribute("data-navigate-to");
    console.log(attribute);
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
      {showComment &&
        createPortal(
          <CommentModal post={comment} setShowComment={setShowComment} />,
          document.body
        )}
      <div
        className="comment-container"
        data-navigate-to={`/comment/${comment.user_info.name}?postId=${comment._id}`}
      >
        <ProfileImage userInfo={comment.user_info} />
        <div
          className="content"
          data-navigate-to={`/comment/${comment.user_info.name}?postId=${comment._id}`}
        >
          <p>{comment.user_info.name}</p>
          <p
            data-navigate-to={`/comment/${comment.user_info.name}?postId=${comment._id}`}
          >
            {comment.content}
          </p>
        </div>
        <SlOptions className="options-btn" />
      </div>
      <footer
        data-navigate-to={`/comment/${comment.user_info.name}?postId=${comment._id}`}
      >
        <PostLike
          post={comment}
          handlePostLikeFunction={handlePostLikeFunction}
        />
        <div className="button-container" onClick={handleCommentModel} id="">
          <IoChatboxOutline className="icon" />
          <p>{comment.commentsCount > 0 && comment.commentsCount}</p>
        </div>
        <div className="button-container">
          <IoIosShareAlt className="icon" />
          <p>{comment.sharesCount > 0 && comment.sharesCount}</p>
        </div>
      </footer>
    </article>
  );
}
