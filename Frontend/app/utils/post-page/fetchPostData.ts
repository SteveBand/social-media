import { SetStateAction } from "react";
import { PostType } from "../../../../types";
import { serverUrl } from "../common";

export async function fetchPostData(postId: string, setContent: setContent) {
  try {
    await fetch(`${serverUrl}/post/${postId}`, {
      credentials: "include",
      method: "GET",
    })
      .then((data) => data.json())
      .then((content) => {
        setContent(content);
      });
  } catch (err: any) {
    console.log("Fetch post Data Error", err.name);
  }
}

type setContent = React.Dispatch<SetStateAction<PostType | null>>;
