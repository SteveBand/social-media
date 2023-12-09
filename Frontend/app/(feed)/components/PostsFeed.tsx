import { useEffect, useState } from "react";
import { Post } from "../../../../types";
import React from "react";

export function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  async function fetchPosts() {
    try {
      const res = await fetch("http://localhost:4000/posts");
      if (res.status === 200) {
        const data = await res.json();
        data && setPosts(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {posts &&
        posts.map((post) => {
          return <article key={post._id}>hi</article>;
        })}
    </>
  );
}
