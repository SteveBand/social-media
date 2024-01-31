import { SetStateAction, useState } from "react";
import { IoChatboxOutline } from "react-icons/io5";
import { PostType } from "../../../types";
import { createPortal } from "react-dom";
import { CommentModal } from "../commentModal/CommentModal";

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

  return (
    <>
      {commentModal &&
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
        onClick={() => setCommentModal((prev) => !prev)}
      />
      <p>{commentsCounts > 0 && commentsCounts}</p>
    </>
  );
}
