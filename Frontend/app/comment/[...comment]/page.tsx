"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useEffect, useMemo, useState } from "react";
import { PostType } from "../../../../types";
import { MainComment } from "./components/MainComment";
import { Comment } from "@/app/post/[...postId]/components/Comment";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function CommentPage() {
  const [content, setContent] = useState<PostType | null>();
  const [comments, setComments] = useState<PostType[] | null>([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = useMemo(() => {
    return searchParams.get("postId");
  }, [searchParams]);
  async function fetchPostData() {
    try {
      const res = await fetch(`http://localhost:4000/comment/post/${postId}`, {
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
    console.log(postId);
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

  console.log("hi");

  if (!content) {
    return <div>no Content</div>;
  }
  return (
    <section className="post-page-wrapper">
      <section className="post-page-container">
        <header>
          <FaArrowLeft className="back-button" onClick={() => router.back()} />
          <p>Post</p>
        </header>
        <MainComment content={content} />
        <form>
          <p>
            Replying to <Link href={"/"}>{content.user_info.name}</Link>
          </p>
          <div className="content">
            {user?.image ? <img src={user?.image} /> : <CgProfile />}
            <textarea
              placeholder="Post your Reply"
              onChange={(e) => setTextAreaValue(e.target.value)}
              value={textAreaValue}
              maxLength={100}
            />
          </div>
          <button onClick={PostReply}>Reply</button>
        </form>
        <section className="comments-section">
          {comments?.map((comment) => {
            return <Comment comment={comment} key={comment._id} />;
          })}
        </section>
      </section>
    </section>
  );
}
