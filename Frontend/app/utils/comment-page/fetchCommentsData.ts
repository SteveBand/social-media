import { serverUrl } from "../common";

export async function fetchCommentsData(postId: string) {
  try {
    const res = await fetch(`${serverUrl}/comments/${postId}`, {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err: any) {
    console.log(err);
  }
}
