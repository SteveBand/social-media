import { SetStateAction } from "react";
import { PostType } from "../../../../types";
import { serverUrl } from "../common";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function fetchPostData(
  postId: string,
  setContent: setContent,
  router: AppRouterInstance
) {
  try {
    const res = await fetch(`${serverUrl}/post/${postId}`, {
      credentials: "include",
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      setContent(data);
    } else {
      router.push("/not-found");
    }
  } catch (err: any) {
    console.log("Fetch post Data Error", err.name);
  }
}

type setContent = React.Dispatch<SetStateAction<PostType | null>>;
