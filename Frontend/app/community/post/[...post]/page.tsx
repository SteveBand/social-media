"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { CommunityPostType } from "../../../../../types";
import { useSession } from "next-auth/react";
import { Comment } from "./components/Comment";
import { MainPost } from "./components/MainPost";
import { BackButton } from "@/components/action-buttons/BackButton";
import "@/styles/post-page/post-page.scss";

export default function CommunityPostPage({
  params,
}: {
  params: { post: [string] };
}) {
  const router = useRouter();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [content, setContent] = useState<CommunityPostType | null>();
  const [comments, setComments] = useState<CommunityPostType[] | null>([]);
  const { data: session } = useSession();
  const user = session?.user;
  const postId = params.post[0];

  async function fetchPost() {
    const res = await fetch(`http://localhost:4000/community/post/${postId}`, {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setContent(data);
    }
  }

  useEffect(() => {
    if (content?._id !== postId) {
      fetchPost();
    }
  }, [postId]);

  if (!content) {
    return <div>No content</div>;
  }

  return (
    <section className="post-page-wrapper">
      <section className="post-page-container">
        <header>
          <BackButton />
          <p>Post</p>
        </header>
        <MainPost content={content} />
        <form>
          <p>
            {/* Replying to <Link href={"/"}>{content?.user_info.name}</Link> */}
          </p>
          <div className="content">
            {user?.image ? <img src={user?.image} /> : <CgProfile />}
            <textarea
              placeholder="Post your Reply"
              onChange={(e) => setTextAreaValue(e.target.value)}
              maxLength={100}
            />
          </div>
          {/* <button onClick={PostReply}>Reply</button> */}
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
