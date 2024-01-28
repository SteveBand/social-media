import { ProfileImage } from "@/components/ProfileImage";
import { PostType } from "../../types";
import { SlOptions } from "react-icons/sl";
import { PostLike } from "@/components/action-buttons/PostLike";
import { IoIosShareAlt } from "react-icons/io";
import { CommentModal } from "@/components/commentModal/CommentModal";
import { createPortal } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/components/post/post.scss";
import { CommentButton } from "./action-buttons/CommentButton";
import { useAppSelector } from "@/hooks";
import { NotLoggedModal } from "./NotLoggedModal";

export function Post({ post, handlePostLikeFunction }: Props) {
  const [showComment, setShowComment] = useState(false);
  const router = useRouter();

  const user = useAppSelector((user) => user.userReducer);

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
        {post.isAuthor && <SlOptions className="post-options-button" />}
      </div>
      <div className="footer-container" data-navigate-to={`/post/${post._id}`}>
        <PostLike post={post} handlePostLikeFunction={handlePostLikeFunction} />
        <div className="button-container">
          <CommentButton setShowComment={setShowComment} />
          <p>{post.commentsCount > 0 && post.commentsCount}</p>
          {showComment &&
            user.status === "authenticated" &&
            createPortal(
              <CommentModal post={post} setShowComment={setShowComment} />,
              document.body
            )}
          {showComment &&
            user.status === "unauthenticated" &&
            createPortal(<NotLoggedModal />, document.body)}
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
  handlePostLikeFunction?: (
    postId: string,
    isLiked: { liked: boolean; likesCount: number }
  ) => void;
};
