import { PostLike } from "@/components/action-buttons/PostLike";
import { IoIosShareAlt } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { PostType } from "../../../../../../types";
import moment from "moment";
import { FollowButton } from "@/components/action-buttons/FollowButton";
import { CommentButton } from "@/components/action-buttons/CommentButton";
import { SetStateAction, useState } from "react";
import { CommentModal } from "@/components/commentModal/CommentModal";
import { createPortal } from "react-dom";
type Props = {
  content: PostType;
  setComments: React.Dispatch<SetStateAction<PostType[]>>;
};

export function MainPost({ content, setComments }: Props) {
  const [showComment, setShowComment] = useState(false);

  if (!content) {
    return <div>None</div>;
  }

  const date = moment(content.createdAt).format("h:mm a · MMM Do YY");

  return (
    <article className="main-post">
      {showComment &&
        createPortal(
          <CommentModal
            post={content}
            setShowComment={setShowComment}
            setComments={setComments}
          />,
          document.body
        )}
      <div className="upper-post">
        <div className="user-details">
          <img src={content.user_info?.avatar_url} />
          <p>{content.user_info?.name}</p>
        </div>
        <div className="action-buttons">
          <FollowButton userData={content.user_info} />
          <SlOptions className="options-btn" />
        </div>
      </div>
      <div className="post-content">
        <p>{content.content}</p>
      </div>
      <footer>
        <div className="post-details">{date}</div>
        <div className="post-action-buttons">
          <PostLike post={content} />
          <div className="button-container">
            <CommentButton setShowComment={setShowComment} />
            <p>{content.commentsCount > 0 && content.commentsCount}</p>
          </div>
          <div className="button-container">
            <IoIosShareAlt className="icon" />
            <p>{content.sharesCount > 0 && content.sharesCount}</p>
          </div>
        </div>
      </footer>
    </article>
  );
}
