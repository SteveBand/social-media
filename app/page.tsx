import Header from "@/components/header/Header";
import Navbar from "@/components/navbar/Navbar";

export default function Page() {
  return (
    <>
      <Header />
      <section className="feed-wrapper">
        <Navbar />
      </section>
    </>
  );
}
