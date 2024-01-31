import { PostLike } from "@/components/action-buttons/PostLike";
import { IoIosShareAlt } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { PostType } from "../../../../../../types";
import moment from "moment";
import { FollowButton } from "@/components/action-buttons/FollowButton";
import { CommentButton } from "@/components/action-buttons/CommentButton";
import { useState } from "react";
type Props = {
  content: PostType;
};

export function MainPost({ content }: Props) {
  const [showComment, setShowComment] = useState(true);

  if (!content) {
    return <div>None</div>;
  }

  const date = moment(content.createdAt).format("h:mm a · MMM Do YY");

  return (
    <article className="main-post">
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
