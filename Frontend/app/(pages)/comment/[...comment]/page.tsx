"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { PostType } from "../../../../../types";
import { MainComment } from "../../../../components/ui/comment/MainComment";
import { Comment } from "@/components/ui/Comment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks";
import {
  postReply,
  fetchCommentsData,
  fetchPostData,
} from "@/app/utils/comment-page";

export default function CommentPage({ params }: { params: any }) {
  const [content, setContent] = useState<PostType | null>(null);
  const [comments, setComments] = useState<PostType[]>([]);
  const [textAreaValue, setTextAreaValue] = useState("");

  const user = useAppSelector((state) => state.userReducer);
  const router = useRouter();
  const postId = params.comment[0];

  useEffect(() => {
    const fetchData = async () => {
      const [postData, commentsData] = await Promise.all([
        fetchPostData(postId),
        fetchCommentsData(postId),
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
          <button
            onClick={(e) =>
              postReply(
                e,
                textAreaValue,
                setTextAreaValue,
                setComments,
                setContent,
                content,
                postId
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
