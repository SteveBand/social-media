import { IoIosShareAlt } from "react-icons/io";
import { CommentType } from "../../../../../types";
import { CommentModal } from "@/components/commentModal/CommentModal";
import { createPortal } from "react-dom";
import { IoChatboxOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { ProfileImage } from "@/components/ProfileImage";
import Link from "next/link";
import { useState } from "react";
import { CommentLike } from "@/components/action-buttons/CommentLike";

type Props = {
  comment: CommentType;
};

export function Comment({ comment }: Props) {
  const [showComment, setShowComment] = useState(false);
  if (!comment || comment === undefined) {
    return <div>No Comments</div>;
  }

  return (
    <Link
      key={comment._id}
      className="comment-wrapper"
      href={`/comment/${comment._id}`}
    >
      <div className="comment-container">
        <img src={comment.user_info.avatar_url} />
        <div className="content">
          <p>{comment.user_info.name}</p>
          <p>{comment.content}</p>
        </div>
        <SlOptions />
      </div>
      <footer>
        <CommentLike comment={comment} />
        <div className="button-container">
          <IoChatboxOutline />
          <p>{comment.commentsCount > 0 && comment.commentsCount}</p>
        </div>
        <div className="button-container"></div>
      </footer>
    </Link>
  );
}
