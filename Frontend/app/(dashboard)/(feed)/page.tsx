"use client";

import Navbar from "@/components/navbar/Navbar";
import PostInput from "./components/PostInput";
import PostModal from "./components/PostModal";
import { createPortal } from "react-dom";
import { useAppSelector } from "@/hooks";
import { PostsFeed } from "./components/PostsFeed";
import { Suspense } from "react";
export default function Page() {
  const modal = useAppSelector((state) => state.postReducer.isModal);

  return (
    <>
      {modal && createPortal(<PostModal />, document.body)}
      <section className="homepage-container">
        <section className="feed-wrapper">
          <PostInput />
          <section className="feed-container">
            <Suspense fallback={<div>hi</div>}>
              <PostsFeed />
            </Suspense>
          </section>
        </section>
      </section>
    </>
  );
}
