import { IoIosShareAlt } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { PostType } from "../../../../../../types";
import { Date } from "@/components/Date";
import { PostLike } from "@/components/action-buttons/PostLike";
type Props = {
  content: PostType | null;
};

export function MainComment({ content }: Props) {
  if (!content) {
    return <div>None</div>;
  }

  return (
    <article className="main-post">
      <div className="upper-post">
        <div className="user-details">
          <img src={content.user_info?.avatar_url} />
          <p>{content.user_info?.name}</p>
        </div>
        <div className="action-buttons">
          <button className="subscribe-btn">Subscribe</button>
          <SlOptions className="options-btn" />
        </div>
      </div>
      <div className="post-content">
        <p>{content.content}</p>
      </div>
      <footer>
        <div className="post-details">
          <Date date={content.createdAt} />
        </div>
        <div className="post-action-buttons">
          <PostLike post={content} />

          <div className="button-container">
            <IoChatboxOutline className="icon" />
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
