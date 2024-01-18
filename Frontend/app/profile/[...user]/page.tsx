import Navbar from "@/components/navbar/Navbar";
import { ProfileContent } from "./components/ProfileContent";

export default async function ProfilePage({
  params,
}: {
  params: { user: any };
}) {
  const userId = params.user.pop();
  const user: User = await fetch(`http://localhost:4000/profile/${userId}`, {
    method: "GET",
    credentials: "include",
  }).then((data) => data.json());

  return (
    <section className="profile-page-wrapper">
      <ProfileContent user={user} />
    </section>
  );
}

type User = {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatar_url: string;
  following: number;
  followers: number;
};
