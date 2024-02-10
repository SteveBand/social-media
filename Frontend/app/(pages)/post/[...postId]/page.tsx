"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { PostType } from "../../../../../types";
import { MainPost } from "../../../../components/ui/post/MainPost";
import { Comment } from "../../../../components/ui/Comment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks";
import {
  fetchPostData,
  fetchCommentsData,
  postReply,
} from "@/app/utils/post-page";

export default function PostPage({ params }: { params: { postId: any } }) {
  const [content, setContent] = useState<PostType | null>(null);
  const [comments, setComments] = useState<PostType[]>([]);
  const [textAreaValue, setTextAreaValue] = useState("");

  const router = useRouter();
  const user = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    if (!content) {
      Promise.all([
        fetchPostData(params.postId[0], setContent),
        fetchCommentsData(params.postId[0], setComments),
      ]).catch((err: any) => {
        console.log(err);
      });
    }
  }, [params.postId]);

  if (!content) {
    return;
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
            Replying to{" "}
            <Link href={`/profile/${content.user_info._id}`}>
              {content.user_info.name}
            </Link>
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
          <button
            onClick={(e) =>
              postReply(
                e,
                textAreaValue,
                params.postId[0],
                setTextAreaValue,
                setComments
              )
            }
            className="action-button"
          >
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
