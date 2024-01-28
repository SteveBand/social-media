import { SetStateAction } from "react";
import { IoChatboxOutline } from "react-icons/io5";

export function CommentButton({
  setShowComment,
}: {
  setShowComment: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <IoChatboxOutline
      className="action-button-icon"
      onClick={() => setShowComment((prev) => !prev)}
    />
  );
}
