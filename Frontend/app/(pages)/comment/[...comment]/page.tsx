"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { PostType } from "../../../../../types";
import { MainComment } from "./components/MainComment";
import { Comment } from "@/components/ui/Comment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks";

export default function CommentPage({ params }: { params: any }) {
  const [content, setContent] = useState<PostType | null>(null);
  const [comments, setComments] = useState<PostType[]>([]);
  const [textAreaValue, setTextAreaValue] = useState("");

  const user = useAppSelector((state) => state.userReducer);
  const router = useRouter();
  const postId = params.comment[0];

  async function fetchPostData() {
    try {
      const res = await fetch(`http://localhost:4000/comment/${postId}`, {
        credentials: "include",
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err: any) {
      console.log("Fetch post Data Error", err.name);
    }
  }

  async function fetchCommentsData() {
    try {
      const res = await fetch(`http://localhost:4000/comments/${postId}`, {
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

  async function PostReply(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const res = await fetch(`http://localhost:4000/new/comment/${postId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ target: "comment", params: textAreaValue }),
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
      setContent((prev) => {
        if (!prev) return null;
        const updatedCount = (content?.commentsCount ?? 0) + 1;
        return {
          ...prev,
          commentsCount: updatedCount,
        };
      });
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const [postData, commentsData] = await Promise.all([
        fetchPostData(),
        fetchCommentsData(),
      ]);
      setContent(postData);
      setComments(commentsData);
    };
    fetchData();
  }, [postId]);

  if (!content) {
    return <div>no Content</div>;
  }

  return (
    <section className="post-page-container">
      <header>
        <FaArrowLeft className="back-button" onClick={() => router.back()} />
        <p>Post</p>
      </header>
      <MainComment content={content} setComments={setComments} />
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
              value={textAreaValue}
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
