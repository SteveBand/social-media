import { SetStateAction } from "react";
import { serverUrl } from "../common";
import { PostType } from "../../../../types";

export async function fetchCommentsData(postId: string, setComments: setComments) {
  try {
    await fetch(`${serverUrl}/comments/${postId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((data) => data.json())
      .then((comments) => setComments(comments));
  } catch (err: any) {
    console.log(err);
  }
}

type setComments = React.Dispatch<SetStateAction<PostType[]>>;
