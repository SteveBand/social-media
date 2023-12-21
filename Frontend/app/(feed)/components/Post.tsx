import { ProfileImage } from "@/components/ProfileImage";
import { PostType } from "../../../../types";
import { SlOptions } from "react-icons/sl";
import { PostLike } from "@/components/action-buttons/PostLike";
import { IoChatboxOutline } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";

export function Post({ post }: { post: PostType }) {
  return (
    <article key={post._id} className="post-wrapper">
      <div className="post-container">
        <ProfileImage userInfo={post.user_info} />
        <div className="post-content">
          <p className="username">{post.user_info.name}</p>
          <p>{post.content}</p>
        </div>
        <SlOptions className="post-options-button" />
      </div>
      <div className="footer-container">
        <PostLike post={post} />
        <div className="button-container">
          <IoChatboxOutline className="action-button-icon" />
          <p>{post.commentsCount > 0 && post.commentsCount}</p>
        </div>
        <div className="button-container">
          <IoIosShareAlt className="action-button-icon" />
        </div>
      </div>
    </article>
  );
}
