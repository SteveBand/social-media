"use client";

import Link from "next/link";
import { CommunityPostType } from "../../types";
import { ProfileImage } from "./ProfileImage";
import { SlOptions } from "react-icons/sl";
import { IoChatboxOutline } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { createPortal } from "react-dom";
import "@/styles/components/post/post.scss";
import { CommunityPostLike } from "./action-buttons/CommunityPostLike";
import { useState } from "react";
import { CommentModal } from "./commentModal/CommentModal";
import { useRouter } from "next/navigation";

export function CommunityPost({ content }: { content: CommunityPostType }) {
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
      key={content._id}
      className="post-wrapper"
      href={`/community/post/${content._id}`}
      prefetch={true}
      onClick={handleNavigation}
    >
      <div className="post-container">
        <ProfileImage userInfo={content.user_info} />
        <div className="post-content">
          <p className="username">{content.user_info.name}</p>
          <p data-navigate-to={`/community/post/${content._id}`}>
            {" "}
            {content.content}
          </p>
        </div>
        <SlOptions className="post-options-button" />
      </div>
      <div
        className="footer-container"
        data-navigate-to={`/community/post/${content._id}`}
      >
        {<CommunityPostLike post={content} />}
        <div className="button-container">
          <IoChatboxOutline
            className="action-button-icon"
            onClick={() => setShowComment((prev) => !prev)}
          />
          <p>{content.commentsCount > 0 && content.commentsCount}</p>
          {showComment &&
            createPortal(
              <CommentModal post={content} setShowComment={setShowComment} />,
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
