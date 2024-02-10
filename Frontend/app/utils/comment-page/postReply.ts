import { SetStateAction } from "react";
import { PostType } from "../../../../types";

export async function postReply(
  e: event,
  textAreaValue: string,
  setTextAreaValue: setTextAreaValue,
  setComments: setComments,
  setContent: setContent,
  content: PostType | null,
  postId: string
) {
  e.preventDefault();
  const res = await fetch(`http://localhost:4000/new/comment/${postId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ target: "comment", params: textAreaValue }),
  });
  if (res.ok) {
    const data = await res.json();
    setTextAreaValue("");
    setComments((prev) => {
      if (prev) {
        const arr = [data, ...prev];
        return arr;
      } else {
        const arr = [data];
        return arr;
      }
    });
    setContent((prev) => {
      if (!prev) return null;
      const updatedCount = (content?.commentsCount ?? 0) + 1;
      return {
        ...prev,
        commentsCount: updatedCount,
      };
    });
  }
}

type event = React.MouseEvent<HTMLButtonElement>;
type setTextAreaValue = React.Dispatch<SetStateAction<string>>;
type setComments = React.Dispatch<SetStateAction<PostType[]>>;
type setContent = React.Dispatch<SetStateAction<PostType | null>>;
