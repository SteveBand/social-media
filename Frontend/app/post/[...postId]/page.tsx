"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { CommentType, PostType } from "../../../../types";
import { MainPost } from "./components/MainPost";
import { Comment } from "./components/Comment";

export default function PostPage({ params }: { params: { postId: any } }) {
  const [content, setContent] = useState<PostType | null>();
  const [comments, setComments] = useState<CommentType[] | null>([]);
  async function fetchPostData() {
    try {
      const postId = params?.postId?.[0];
      console.log(postId);
      await fetch(`http://localhost:4000/post/${postId}`, {
        cache: "no-cache",
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((data) => data.json())
        .then((content) => {
          setContent(content);
        });
    } catch (err) {
      console.log("AHHH SHIT AN ERROR");
    }
  }

  async function fetchCommentsData() {
    try {
      const postId = params?.postId?.[0];
      await fetch(`http://localhost:4000/comments/${postId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((data) => data.json())
        .then((comments) => setComments(comments));
    } catch (err) {
      console.log("AHH shit ERROR");
    }
  }

  useEffect(() => {
    Promise.all([fetchPostData(), fetchCommentsData()]).catch((err: any) => {
      console.log(err);
    });
  }, []);

  if (!content) {
    return <div>no Content</div>;
  }

  return (
    <section className="post-page-wrapper">
      <section className="post-page-container">
        <header>
          <FaArrowLeft className="back-button" />
          <p>Post</p>
        </header>
        <MainPost content={content} />
        <section>
          {comments?.map((comment) => {
            return <Comment comment={comment} />;
          })}
        </section>
      </section>
    </section>
  );
}
