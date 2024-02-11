"use client";

import PostInput from "../../../components/ui/feed/PostInput";
import PostModal from "../../../components/modals/PostModal";
import { createPortal } from "react-dom";
import { PostsFeed } from "../../../components/ui/feed/PostsFeed";
import { useState } from "react";
import { useAppSelector } from "@/hooks";
import { PostType } from "../../../../types";

export default function Page() {
  const [modal, setModal] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const user = useAppSelector((state) => state.userReducer);

  return (
    <>
      {modal && createPortal(<PostModal setModal={setModal} setPosts={setPosts} />, document.body)}
      <section className="feed-wrapper">
        <PostInput setModal={setModal} />
        <section className="feed-container">
          <PostsFeed setPosts={setPosts} posts={posts} />
        </section>
      </section>
    </>
  );
}
