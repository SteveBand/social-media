"use client";

import Navbar from "@/components/navbar/Navbar";
import PostInput from "./components/PostInput";
import PostModal from "./components/PostModal";
import { createPortal } from "react-dom";
import { useAppSelector } from "@/hooks";
export default function Page() {
  // const [modal, setModal] = useState(false);
  const modal = useAppSelector((state) => state.postReducer.isModal);

  return (
    <>
      {modal && createPortal(<PostModal />, document.body)}
      <section className="homepage-container">
        <Navbar />
        <section className="feed-wrapper">
          <PostInput />
          <section className="feed-container"></section>
        </section>
      </section>
    </>
  );
}
