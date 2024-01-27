import { ProfileImage } from "@/components/ProfileImage";
import { PostType } from "../../types";
import { SlOptions } from "react-icons/sl";
import { PostLike } from "@/components/action-buttons/PostLike";
import { IoChatboxOutline } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { CommentModal } from "@/components/commentModal/CommentModal";
import { createPortal } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/components/post/post.scss";
export function Post({ post, posts }: Props) {
  const [showComment, setShowComment] = useState(false);
  const router = useRouter();
  function handleNavigation(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const attribute = target.getAttribute("data-navigate-to");
    if (attribute) {
      router.push(attribute);
    }
  }

  return (
    <Link
      key={post._id}
      className="post-wrapper"
      href={`/post/${post._id}`}
      prefetch={true}
      onClick={handleNavigation}
    >
      <div className="post-container">
        <ProfileImage userInfo={post.user_info} />
        <div className="post-content">
          <p className="username">{post.user_info.name}</p>
          <p data-navigate-to={`/post/${post._id}`}> {post.content}</p>
        </div>
        <SlOptions className="post-options-button" />
      </div>
      <div className="footer-container" data-navigate-to={`/post/${post._id}`}>
        <PostLike post={post} />
        <div className="button-container">
          <IoChatboxOutline
            className="action-button-icon"
            onClick={() => setShowComment((prev) => !prev)}
          />
          <p>{post.commentsCount > 0 && post.commentsCount}</p>
          {showComment &&
            createPortal(
              <CommentModal post={post} setShowComment={setShowComment} />,
              document.body
            )}
        </div>
        <div className="button-container">
          <IoIosShareAlt className="action-button-icon" />
        </div>
      </div>
    </Link>
  );
}

type Props = {
  post: PostType;
  posts?: PostType[];
};
