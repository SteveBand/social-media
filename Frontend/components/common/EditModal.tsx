import { SetStateAction, useState } from "react";
import { PostType } from "../../../types";
import { IoMdClose } from "react-icons/io";

import "@/styles/components/editModal.scss";
import { DataType } from "@/app/(dashboard)/profile/[...user]/components/ProfileContent";
export function EditModal({
  currentPost,
  setEditModal,
  setPosts,
  setData,
}: Props) {
  const [editParams, setEditParams] = useState("");
  const target = currentPost.isPost ? "post" : "comment";

  async function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/${target}/${currentPost._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editParams }),
        }
      );
      if (res.ok) {
        setEditModal(false);
        if (setPosts) {
          setPosts((prev) => {
            return prev.map((post) => {
              if (post._id === currentPost._id) {
                return { ...post, content: editParams };
              }
              return post;
            });
          });
        }

        if (setData) {
          setData((prev) => {
            const updatedPostsArr = prev.posts.map((post) => {
              if (post._id === currentPost._id) {
                return { ...post, content: editParams };
              }
              return post;
            });
            return { ...prev, posts: updatedPostsArr };
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="edit-modal-wrapper">
      <form className="edit-form">
        <IoMdClose
          className="close-icon"
          onClick={() => setEditModal((prev) => !prev)}
        />
        <h3>Edit Post </h3>
        <textarea
          defaultValue={currentPost.content}
          minLength={2}
          maxLength={150}
          onChange={(e) => setEditParams(e.target.value)}
        />
        <button onClick={handleEdit}>Edit</button>
      </form>
    </section>
  );
}

type Props = {
  currentPost: PostType;
  setEditModal: React.Dispatch<SetStateAction<boolean>>;
  setPosts?: React.Dispatch<SetStateAction<PostType[]>>;
  setData?: React.Dispatch<SetStateAction<DataType>>;
};
