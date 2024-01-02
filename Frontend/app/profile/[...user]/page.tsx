import Navbar from "@/components/navbar/Navbar";
import { FaArrowLeft } from "react-icons/fa6";

export default async function ProfilePage({
  params,
}: {
  params: { user: any };
}) {
  const userId = params.user.pop();
  const user = await fetch(`http://localhost:4000/profile/${userId}`, {
    method: "GET",
    credentials: "include",
  }).then((data) => data.json());

  return (
    <section className="profile-page-wrapper">
      <Navbar />
    </section>
  );
}
