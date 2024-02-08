"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { PostType } from "../../../../../types";
import { MainPost } from "./components/MainPost";
import { Comment } from "../../../../components/common/Comment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks";
export default function PostPage({ params }: { params: { postId: any } }) {
  const [content, setContent] = useState<PostType | null>();
  const [comments, setComments] = useState<PostType[]>([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const router = useRouter();
  const user = useAppSelector((state) => state.userReducer);

  async function fetchPostData() {
    try {
      const postId = params?.postId?.[0];
      await fetch(`http://localhost:4000/post/${postId}`, {
        credentials: "include",
        method: "GET",
      })
        .then((data) => data.json())
        .then((content) => {
          setContent(content);
        });
    } catch (err: any) {
      console.log("Fetch post Data Error", err.name);
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
    } catch (err: any) {
      console.log(err);
    }
  }

  async function PostReply(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const postId = params?.postId?.[0];
    const res = await fetch(`http://localhost:4000/new/comment/${postId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ params: textAreaValue }),
    });
    if (res.ok) {
      const data = await res.json();
      setTextAreaValue("");
      setComments((prev) => {
        if (prev) {
          const arr = [data, ...prev];
          return arr;
        } else {
          const arr = [data];
          return arr;
        }
      });
    }
  }

  useEffect(() => {
    if (!content) {
      Promise.all([fetchPostData(), fetchCommentsData()]).catch((err: any) => {
        console.log(err);
      });
    }
  }, []);

  if (!content) {
    return <div>no Content</div>;
  }
  return (
    <section className="post-page-container">
      <header>
        <FaArrowLeft className="back-button" onClick={() => router.back()} />
        <p>Post</p>
      </header>
      <MainPost content={content} setComments={setComments} />
      {user.status === "authenticated" && (
        <form>
          <p>
            Replying to <Link href={"/"}>{content.user_info.name}</Link>
          </p>
          <div className="content">
            {user?.user_info.avatar_url ? (
              <img src={user?.user_info.avatar_url} />
            ) : (
              <CgProfile />
            )}
            <textarea
              placeholder="Post your Reply"
              onChange={(e) => setTextAreaValue(e.target.value)}
              maxLength={100}
            />
          </div>
          <button onClick={PostReply} className="action-button">
            Reply
          </button>
        </form>
      )}
      <section className="comments-section">
        {comments?.map((comment) => {
          return (
            <Comment
              comment={comment}
              key={comment._id}
              setComments={setComments}
            />
          );
        })}
      </section>
    </section>
  );
}
