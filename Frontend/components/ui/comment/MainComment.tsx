import { IoIosShareAlt } from "react-icons/io";
import { SlOptions } from "react-icons/sl";
import { PostType } from "../../../../types";
import { PostLike } from "@/components/action-buttons/PostLike";
import moment from "moment";
import { FollowButton } from "@/components/action-buttons/FollowButton";
import { useAppSelector } from "@/hooks";
import { CommentButton } from "@/components/action-buttons/CommentButton";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { createPortal } from "react-dom";
import { EditModal } from "@/components/modals/EditModal";
import { serverUrl } from "@/app/utils/common";

type Props = {
  content: PostType | null;
  setComments: React.Dispatch<SetStateAction<PostType[]>>;
  setContent: React.Dispatch<SetStateAction<PostType | null>>;
};

export function MainComment({ content, setComments, setContent }: Props) {
  const user = useAppSelector((state) => state.userReducer);
  const [optionsModal, setOptionsModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const router = useRouter();

  if (!content) {
    return;
  }

  const date = moment(content.createdAt).format("h:mm a · MMM Do YY");
  const sameUser = user.user_info._id === content.user_info._id;

  const image = content.user_info.avatar_url ? (
    <img src={content.user_info.avatar_url} />
  ) : (
    <CgProfile />
  );

  async function handleDelete() {
    try {
      const res = await fetch(`${serverUrl}/comment/${content?._id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {editModal &&
        createPortal(
          <EditModal
            currentPost={content}
            setEditModal={setEditModal}
            setPost={setContent}
          />,
          document.body
        )}
      <article className="main-post">
        <div className="upper-post">
          <div
            className="user-details"
            onClick={() => router.push(`/profile/${content.user_info._id}`)}
          >
            {image}
            <p>{content.user_info?.name}</p>
          </div>
          <div className="action-buttons">
            {!sameUser && <FollowButton userData={content.user_info} />}
            {(sameUser || user.user_info.admin) && (
              <SlOptions
                className="options-btn"
                onClick={() => setOptionsModal((prev) => !prev)}
              />
            )}
            {optionsModal && (
              <article className="options-modal">
                <div onClick={() => handleDelete()}>Delete</div>
                {content.parentId === user.user_info._id && (
                  <div onClick={() => setEditModal((prev) => !prev)}>Edit</div>
                )}
              </article>
            )}
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
              <CommentButton content={content} setComments={setComments} />
            </div>
            <div className="button-container">
              <IoIosShareAlt className="icon" />
              <p>{content.sharesCount > 0 && content.sharesCount}</p>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}
