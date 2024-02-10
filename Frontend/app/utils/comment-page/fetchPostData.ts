import { serverUrl } from "../common";

export async function fetchPostData(postId: string) {
  try {
    const res = await fetch(`${serverUrl}/comment/${postId}`, {
      credentials: "include",
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.log("Fetch post Data Error", err);
  }
}
