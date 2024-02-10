import { SetStateAction } from "react";
import { PostType } from "../../../../types";
import { serverUrl } from "../common";

export async function fetchPosts(
  id: string,
  action: string,
  setPosts: React.Dispatch<SetStateAction<PostType[]>>
) {
  if (action === "adminPanel") return;
  const res = await fetch(`${serverUrl}/community/${id}/${action}`, {
    method: "GET",
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    setPosts(data);
  }
}
