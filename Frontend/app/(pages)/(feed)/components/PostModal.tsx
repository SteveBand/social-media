"use client";
import { SetStateAction, useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { PostSchema } from "@/lib/schemas";
import { useAppSelector } from "@/hooks";
import { IoMdClose } from "react-icons/io";

type Props = {
  setModal: React.Dispatch<SetStateAction<boolean>>;
};

export default function PostModal({ setModal }: Props) {
  const user = useAppSelector((state) => state.userReducer);
  const [params, setParams] = useState({
    content: "",
  });
  const [isValid, setIsValid] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { id, value } = e.target;
    const obj = {
      ...params,
      [id]: value,
    };

    setParams(obj);
    const validation = PostSchema.validate(params, { abortEarly: true });
    if (validation.error !== undefined) {
      const error = validation.error.details.find((e) => e.context?.key === id);
      error && setIsValid(false);
    }
    if (validation.error === undefined) {
      setIsValid(true);
    }
  }

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/new/post", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      setModal(false);
    }
  }

  return (
    <section className="feed-post-modal-wrapper">
      <form className="feed-post-modal-container">
        <div className="profile-content">
          {user.user_info.avatar_url ? (
            <img src={user.user_info.avatar_url} width={50} />
          ) : (
            <PiUserCircle className="icon" />
          )}
          <p>{`${user.user_info.name}`}</p>
          <IoMdClose
            className="modal-close-icon"
            onClick={() => setModal((prev) => !prev)}
          />
        </div>
        <div className="inputs">
          <textarea
            name="content"
            id="content"
            placeholder="Write here"
            onChange={handleInput}
          />
        </div>
        <button
          className={`${
            isValid
              ? "feed-post-modal-button"
              : "feed-post-modal-button-invalid"
          }`}
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Post
        </button>
      </form>
    </section>
  );
}
