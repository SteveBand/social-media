"use client";
import { SetStateAction, useState } from "react";
import { PiUserCircle } from "react-icons/pi";
import { useAppSelector } from "@/hooks";
import { IoMdClose } from "react-icons/io";
import { handleSubmit, handleParams } from "@/app/utils/feed-page/feed-modal";
import { PostType } from "../../../types";

type Props = {
  setModal: React.Dispatch<SetStateAction<boolean>>;
  setPosts: React.Dispatch<SetStateAction<PostType[]>>;
};

export default function PostModal({ setModal, setPosts }: Props) {
  const user = useAppSelector((state) => state.userReducer);
  const [params, setParams] = useState({
    content: "",
  });
  const [isValid, setIsValid] = useState(false);

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
            onChange={(e) => handleParams(e, params, setParams, setIsValid)}
          />
        </div>
        <button
          className={`${
            isValid
              ? "feed-post-modal-button"
              : "feed-post-modal-button-invalid"
          }`}
          onClick={(e) => handleSubmit(e, params, setModal, setPosts)}
          disabled={!isValid}
        >
          Post
        </button>
      </form>
    </section>
  );
}
