"use client";

import { useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { useAppSelector } from "@/hooks";
import { PostSchema } from "@/lib/schemas";
import moment from "moment";
type Props = {};

export default function PostModal({}: Props) {
  const user = useAppSelector((state) => state.authReducer);
  const [params, setParams] = useState({
    parentId: user.id,
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
    const formattedDate = moment().format("MMMM Do YYYY, h:mm:ss a");
    const newObj = {
      ...params,
      date: formattedDate,
    };

    const res = await fetch("http://localhost:3000/api/new/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Bearer-token": user.token,
      },
      body: JSON.stringify(newObj),
    });
  }

  return (
    <section className="feed-post-modal-wrapper">
      <form className="feed-post-modal-container">
        <div className="profile-content">
          <PiUserCircle className="icon" />
          <p>Steve.Bndkr</p>
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
