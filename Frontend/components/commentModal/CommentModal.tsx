import { useSession } from "next-auth/react";
import { PostType } from "../../../types";
import { IoIosClose } from "react-icons/io";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  post: PostType;
  setShowComment: Dispatch<SetStateAction<boolean>>;
};

export function CommentModal({ post, setShowComment }: Props) {
  const [params, setParams] = useState<String>();
  const { data: session } = useSession();
  const user = session?.user;

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
      body: JSON.stringify({ params }),
    });
    if (res.status === 200) {
      setShowComment(false);
    }
  }

  return (
    <section className="comment-modal-wrapper">
      <section className="container">
        <header>
          <IoIosClose className="icon" onClick={() => setShowComment(false)} />
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
            <img src={user?.image || ""} />
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
