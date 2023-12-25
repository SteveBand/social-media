import { IoIosShareAlt } from "react-icons/io";
import { CommentType } from "../../../../../types";
import { CommentModal } from "@/components/commentModal/CommentModal";
import { createPortal } from "react-dom";
import { IoChatboxOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import Link from "next/link";
import { ReactHTMLElement, useState } from "react";
import { CommentLike } from "@/components/action-buttons/CommentLike";
import { useRouter } from "next/navigation";

type Props = {
  comment: CommentType;
};

export function Comment({ comment }: Props) {
  const [showComment, setShowComment] = useState(false);
  const router = useRouter();
  if (!comment || comment === undefined) {
    return <div>No Comments</div>;
  }

  const handleCommentModel = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowComment(true);
  };

  return (
    <article
      key={comment._id}
      className="comment-wrapper"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const attribute = target.getAttribute("data-navigate-to");
        if (!attribute) {
          return;
        } else {
          router.push(attribute);
        }
      }}
    >
      {showComment &&
        createPortal(
          <CommentModal post={comment} setShowComment={setShowComment} />,
          document.body
        )}
      <div
        className="comment-container"
        data-navigate-to={`/post/${comment._id}`}
      >
        <img src={comment.user_info.avatar_url} />
        <div className="content" data-navigate-to={`/post/${comment._id}`}>
          <p>{comment.user_info.name}</p>
          <p data-navigate-to={`/post/${comment._id}`}>{comment.content}</p>
        </div>
        <SlOptions />
      </div>
      <footer data-navigate-to={`/post/${comment._id}`}>
        <CommentLike comment={comment} />
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
