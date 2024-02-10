import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Post } from "../Post";
import { PostType } from "../../../../types";
import { serverUrl } from "@/app/utils/common";

export function PostsFeed() {
  const [posts, setPosts] = useState<PostType[]>([]);

  async function fetchPosts() {
    try {
      const res = await fetch(`${serverUrl}/posts`, {
        cache: "default",
        method: "GET",
        credentials: "include",
      });
      if (res.status === 200) {
        const data = await res.json();
        data && setPosts(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, []);

  return (
    <>
      {posts &&
        posts.map((post) => {
          return <Post post={post} key={post._id} setPosts={setPosts} />;
        })}
    </>
  );
}
