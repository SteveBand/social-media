import { CommentType, PostType } from "../../../types";
import { IoIosClose } from "react-icons/io";
import { SetStateAction, useState } from "react";
import { useAppSelector } from "@/hooks";
import { NotLoggedModal } from "../notLoggedModal/NotLoggedModal";

type Props = {
  post: PostType | CommentType;
  setComments?: React.Dispatch<SetStateAction<PostType[]>>;
  setCommentsCount: React.Dispatch<SetStateAction<number>>;
  setCommentModal: React.Dispatch<SetStateAction<boolean>>;
};

export function CommentModal({
  post,
  setComments,
  setCommentsCount,
  setCommentModal,
}: Props) {
  const [params, setParams] = useState<String>();

  const user = useAppSelector((state) => state.userReducer);

  async function postComment(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    const res = await fetch(`http://localhost:4000/new/comment/${post._id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        params,
        target: post.isPost ? "post" : "comment",
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCommentsCount((prev) => prev++);
      setComments &&
        setComments((prev) => {
          return [...prev, data];
        });
    }
  }

  if (user.status === "unauthenticated") {
    return <NotLoggedModal />;
  }

  return (
    <section className="comment-modal-wrapper">
      <section className="container">
        <header>
          <IoIosClose
            className="icon"
            onClick={() => setCommentModal((prev) => !prev)}
          />
        </header>
        <article className="parent-post">
          <div className="content">
            <img src={post.user_info.avatar_url} />
            <div className="right-side">
              <p>{post.user_info.name}</p>
              <p>{post.content}</p>
            </div>
          </div>
        </article>
        <article className="comment-post">
          <div className="content">
            <img src={user?.user_info.avatar_url || ""} />
            <textarea
              placeholder="Post a comment Here..."
              onChange={(e) => {
                setParams(e.target.value);
              }}
            />
          </div>
        </article>
        <footer>
          <button onClick={postComment}>Comment</button>
        </footer>
      </section>
    </section>
  );
}
