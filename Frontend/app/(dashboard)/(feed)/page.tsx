"use client";

import PostInput from "./components/PostInput";
import PostModal from "./components/PostModal";
import { createPortal } from "react-dom";
import { PostsFeed } from "./components/PostsFeed";
import { useState } from "react";

export default function Page() {
  const [modal, setModal] = useState(false);
  return (
    <>
      {modal && createPortal(<PostModal />, document.body)}
      <section className="feed-wrapper">
        <PostInput setModal={setModal} />
        <section className="feed-container">
          <PostsFeed />
        </section>
      </section>
    </>
  );
}
