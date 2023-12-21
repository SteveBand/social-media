"use client";

import { SlOptions } from "react-icons/sl";
import { Date } from "@/components/Date";
import { PostLike } from "@/components/action-buttons/PostLike";
import { IoChatboxOutline } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { PostType } from "../../../../types";
import { useRouter } from "next/navigation";

export default function PostPage({ params }: { params: { postId: any } }) {
  const [content, setContent] = useState<PostType | null>();
  const router = useRouter();

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
        .then((content) => setContent(content));
    } catch (err) {
      console.log("AHHH SHIT AN ERROR");
    }
  }

  useEffect(() => {
    fetchPostData();
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
        <article className="main-post">
          <div className="upper-post">
            <div className="user-details">
              <img src={content.user_info?.avatar_url} />
              <p>{content.user_info?.name}</p>
            </div>
            <div className="action-buttons">
              <button className="subscribe-btn">Subscribe</button>
              <SlOptions className="options-btn" />
            </div>
          </div>
          <div className="post-content">
            <p>{content.content}</p>
          </div>
          <footer>
            <div className="post-details">
              <Date date={content.date} />
            </div>
            <div className="post-action-buttons">
              <PostLike post={content} />
              <IoChatboxOutline className="icon" />
              <IoIosShareAlt className="icon" />
            </div>
          </footer>
        </article>
      </section>
    </section>
  );
}
