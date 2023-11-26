"use client";

import Navbar from "@/components/navbar/Navbar";
import PostInput from "./components/PostInput";
import PostModal from "./components/PostModal";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function Page() {
  const [modal, setModal] = useState(false);
  return (
    <>
      {modal && createPortal(<PostModal />, document.body)}
      <section className="homepage-container">
        <Navbar />
        <section className="feed-wrapper">
          <PostInput setModal={setModal} />
          <section className="feed-container">
            
          </section>
        </section>
      </section>
    </>
  );
}
