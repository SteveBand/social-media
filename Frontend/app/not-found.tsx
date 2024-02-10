import Link from "next/link";
import "@/styles/pages/notfound-page/notfound.scss";
export default function NotFound() {
  return (
    <section className="notfound-wrapper">
      <div className="notfound-logo">
        <h1>4</h1>
        <h1>0</h1>
        <h1>4</h1>
      </div>
      <h2>Looks like you're Lost, Let me help you with that</h2>
      <Link href="/">Back Home!</Link>
    </section>
  );
}
