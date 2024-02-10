import { SetStateAction } from "react";
import { PostType } from "../../../../types";
import { serverUrl } from "../common";

export async function handlePost(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  setContent: React.Dispatch<SetStateAction<string>>,
  communityId: string,
  content: string,
  setPosts: React.Dispatch<SetStateAction<PostType[]>>
) {
  e.preventDefault();
  try {
    const res = await fetch(
      `${serverUrl}/community/${communityId}/new/post?content=${content}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      const post = await res.json();
      setContent("");
      setPosts((prev) => {
        return [...prev, post];
      });
    }
  } catch (err) {
    console.log(
      "An error has Occured at CommunityContent.tsx Component at handleFetch Function",
      err
    );
  }
}
