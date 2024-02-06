import { ProfileImage } from "@/components/common/ProfileImage";
import { PostType } from "../../../types";
import { SlOptions } from "react-icons/sl";
import { PostLike } from "@/components/common/action-buttons/PostLike";
import { IoIosShareAlt } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/components/post/post.scss";
import { CommentButton } from "./action-buttons/CommentButton";
import { useAppSelector } from "@/hooks";
import { SetStateAction, useState } from "react";
import { DataType } from "@/app/(dashboard)/profile/[...user]/components/ProfileContent";

export function Post({
  post,
  handlePostLikeFunction,
  setPosts,
  setData,
}: Props) {
  const [optionsModal, setOptionsModal] = useState(false);
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

  async function handleDelete() {
    try {
      const res = await fetch(`http://localhost:4000/post/${post._id}/delete`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setPosts &&
          setPosts((prev) => {
            const newArr = prev.filter((el) => el._id !== post._id);
            return newArr;
          });

        setData &&
          setData((prev) => {
            const newPostArr = prev.posts.filter((el) => el._id !== post._id);
            const newObj = {
              ...prev,
              posts: newPostArr,
            };
            return newObj;
          });
      }
    } catch (error) {
      console.log(error);
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
        {(post.isAuthor || user.user_info.admin) && (
          <SlOptions
            className="post-options-button"
            onClick={() => setOptionsModal((prev) => !prev)}
          />
        )}
      </div>
      <div className="footer-container" data-navigate-to={`/post/${post._id}`}>
        <PostLike post={post} handlePostLikeFunction={handlePostLikeFunction} />
        <div className="button-container">
          <CommentButton content={post} />
        </div>
        <div className="button-container">
          <IoIosShareAlt className="action-button-icon" />
        </div>
      </div>
      {optionsModal && (
        <article className="options-modal">
          <div onClick={() => handleDelete()}>Delete</div>
          <div>Edit</div>
        </article>
      )}
    </Link>
  );
}

type Props = {
  post: PostType;
  handlePostLikeFunction?: (
    postId: string,
    isLiked: { liked: boolean; likesCount: number }
  ) => void;
  setPosts?: React.Dispatch<SetStateAction<PostType[]>>;
  setData?: React.Dispatch<SetStateAction<DataType>>;
};
