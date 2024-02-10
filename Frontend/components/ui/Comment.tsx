import { IoIosShareAlt } from "react-icons/io";
import { PostType } from "../../../types";
import { SlOptions } from "react-icons/sl";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { PostLike } from "@/components/action-buttons/PostLike";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { CommentButton } from "@/components/action-buttons/CommentButton";
import { useAppSelector } from "@/hooks";
import { createPortal } from "react-dom";
import { EditModal } from "../modals/EditModal";

type Props = {
  comment: PostType;
  handlePostLikeFunction?: (
    postId: string,
    isLiked: { liked: boolean; likesCount: number }
  ) => void;
  setComments?: React.Dispatch<SetStateAction<PostType[]>>;
};

export function Comment({
  comment,
  handlePostLikeFunction,
  setComments,
}: Props) {
  const [optionsModal, setOptionsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const router = useRouter();
  const user = useAppSelector((state) => state.userReducer);

  if (!comment || comment === undefined) {
    return <div>No Comments</div>;
  }

  function handleNavigation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    const attribute = target.getAttribute("data-navigate-to");
    if (!attribute) {
      return;
    } else {
      console.log(router.push(attribute));
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(
        `http://localhost:4000/comment/${comment._id}/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        setComments &&
          setComments((prev) => {
            const newArr = prev.filter((el) => el._id !== comment._id);
            return newArr;
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {editModal &&
        createPortal(
          <EditModal currentPost={comment} setEditModal={setEditModal} />,
          document.body
        )}
      <article
        key={comment._id}
        className="comment-wrapper"
        onClick={handleNavigation}
      >
        <div
          className="comment-container"
          data-navigate-to={`/comment/${comment._id}?postId=${comment._id}`}
        >
          <ProfileImage userInfo={comment.user_info} />
          <div
            className="content"
            data-navigate-to={`/comment/${comment._id}?postId=${comment._id}`}
          >
            <p>{comment.user_info.name}</p>
            <p
              data-navigate-to={`/comment/${comment._id}?postId=${comment._id}`}
            >
              {comment.content}
            </p>
          </div>
          {(comment.isAuthor || user.user_info.admin) && (
            <SlOptions
              className="options-btn"
              onClick={() => setOptionsModal((prev) => !prev)}
            />
          )}
        </div>
        <footer
          data-navigate-to={`/comment/${comment._id}?postId=${comment._id}`}
        >
          <PostLike
            post={comment}
            handlePostLikeFunction={handlePostLikeFunction}
          />
          <div className="button-container" id="">
            <CommentButton content={comment} setComments={setComments} />
          </div>
          <div className="button-container">
            <IoIosShareAlt className="icon" />
            <p>{comment.sharesCount > 0 && comment.sharesCount}</p>
          </div>
        </footer>
        {optionsModal && (
          <article className="options-modal">
            <div onClick={() => handleDelete()}>Delete</div>
            <div onClick={() => setEditModal((prev) => !prev)}>Edit</div>
          </article>
        )}
      </article>
    </>
  );
}
