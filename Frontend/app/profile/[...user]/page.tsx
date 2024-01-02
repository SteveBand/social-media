import Navbar from "@/components/navbar/Navbar";
import { FaArrowLeft } from "react-icons/fa6";

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
      <Navbar />
      <section className="profile-content">
        <header>
          <FaArrowLeft className="icon" />
          <h4>{user.name}</h4>
        </header>
        <article className="user-content">
          <img src={user.avatar_url} />
          <div className="content">
            <h5>{user.name}</h5>
            <p>{user.bio}</p>
            <p>Joined "Date"</p>
            <div className="followers-container">
              <p>{user.following} Following</p>
              <p>{user.followers} Followers</p>
            </div>
          </div>
        </article>
        <div className="profile-navbar-container">
          <ul className="profile-page-navbar">
            <li>Posts</li>
            <li>Likes</li>
            <li>Replies</li>
            <li>Following</li>
            <li>Followers</li>
          </ul>
        </div>
      </section>
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
