import { SetStateAction } from "react";
import { serverUrl } from "../common";
import { PostType } from "../../../../types";

export async function postReply(
  e: event,
  textAreaValue: string,
  postId: string,
  setTextAreaValue: setTextAreaValue,
  setComments: setComments
) {
  e.preventDefault();
  try {
    const res = await fetch(`${serverUrl}/new/comment/${postId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ target: "post", params: textAreaValue }),
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
    }
  } catch (error) {
    console.log(error);
  }
}

type event = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type setTextAreaValue = React.Dispatch<SetStateAction<string>>;
type setComments = React.Dispatch<SetStateAction<PostType[]>>;
