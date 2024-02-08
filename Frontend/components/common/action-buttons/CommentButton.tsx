import { SetStateAction, useState } from "react";
import { IoChatboxOutline } from "react-icons/io5";
import { PostType } from "../../../../types";
import { createPortal } from "react-dom";
import { CommentModal } from "../commentModal/CommentModal";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { activate } from "@/redux/features/loginModal-slice";

export function CommentButton({
  content,
  setComments,
}: {
  content: PostType;
  setComments?: React.Dispatch<SetStateAction<PostType[]>>;
}) {
  const [commentsCounts, setCommentsCount] = useState(
    content.commentsCount || 0
  );

  const [commentModal, setCommentModal] = useState(false);

  const dispatch = useAppDispatch();
  const loginModal = useAppSelector((state) => state.loginReducer.isModal);
  const user = useAppSelector((state) => state.userReducer.status);

  function handleModal() {
    if (user === "unauthenticated") {
      dispatch(activate());
    } else {
      setCommentModal((prev) => !prev);
    }
  }

  return (
    <>
      {commentModal &&
        !loginModal &&
        createPortal(
          <CommentModal
            post={content}
            setComments={setComments}
            setCommentsCount={setCommentsCount}
            setCommentModal={setCommentModal}
          />,
          document.body
        )}
      <IoChatboxOutline
        className="action-button-icon"
        onClick={() => handleModal()}
      />
      <p>{commentsCounts > 0 && commentsCounts}</p>
    </>
  );
}
