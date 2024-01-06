"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { PostType } from "../../../../types";
import { MainPost } from "./components/MainPost";
import { Comment } from "./components/Comment";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostPage({
  params,
  target,
}: {
  params: { postId: any };
  target: any;
}) {
  const [content, setContent] = useState<PostType | null>();
  const [comments, setComments] = useState<PostType[] | null>([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

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
      body: JSON.stringify({ params: textAreaValue, target: "post" }),
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
    <section className="post-page-wrapper">
      <section className="post-page-container">
        <header>
          <FaArrowLeft className="back-button" onClick={() => router.back()} />
          <p>Post</p>
        </header>
        <MainPost content={content} />
        <form>
          <p>
            Replying to <Link href={"/"}>{content.user_info.name}</Link>
          </p>
          <div className="content">
            {user?.image ? <img src={user?.image} /> : <CgProfile />}
            <textarea
              placeholder="Post your Reply"
              onChange={(e) => setTextAreaValue(e.target.value)}
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
