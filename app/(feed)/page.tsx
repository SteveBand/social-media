import Navbar from "@/components/navbar/Navbar";
import PostInput from "./components/PostInput";

export default function Page() {
  return (
    <>
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
