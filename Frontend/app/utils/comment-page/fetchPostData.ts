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
    if (res.status === 404) {
      return null;
    }
  } catch (err) {
    console.log("Fetch post Data Error", err);
  }
}
