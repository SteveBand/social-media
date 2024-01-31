import { IoIosShareAlt } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { PostType } from "../../../../../../types";
import { PostLike } from "@/components/action-buttons/PostLike";
import moment from "moment";
import { FollowButton } from "@/components/action-buttons/FollowButton";
import { useAppSelector } from "@/hooks";
import { CommentButton } from "@/components/action-buttons/CommentButton";
import { SetStateAction, useState } from "react";
import { createPortal } from "react-dom";
import { CommentModal } from "@/components/commentModal/CommentModal";

type Props = {
  content: PostType | null;
  setComments: React.Dispatch<SetStateAction<PostType[]>>;
};

export function MainComment({ content, setComments }: Props) {
  const user = useAppSelector((state) => state.userReducer);

  if (!content) {
    return <div>None</div>;
  }

  const date = moment(content.createdAt).format("h:mm a · MMM Do YY");
  const sameUser = user.user_info._id === content.user_info._id;

  return (
    <article className="main-post">
      <div className="upper-post">
        <div className="user-details">
          <img src={content.user_info?.avatar_url} />
          <p>{content.user_info?.name}</p>
        </div>
        <div className="action-buttons">
          {!sameUser && <FollowButton userData={content.user_info} />}
          {<SlOptions className="options-btn" />}
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
            <CommentButton
             
              content={content}
              setComments={setComments}
            />
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
