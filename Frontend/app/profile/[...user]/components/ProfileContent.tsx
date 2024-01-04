"use client";

import { FaArrowLeft } from "react-icons/fa";
import { PostType, User } from "../../../../../types";
import { useEffect, useState } from "react";
import { Post } from "@/components/Post";
import { Follower } from "@/components/Follower";

export function ProfileContent({ user }: { user: User }) {
  const [action, setAction] = useState("posts");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchData() {
    setData([]);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/${user.email}/${action}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const fetchedData = await res.json();
        setData(fetchedData);
        setLoading(false);
      }
    } catch (err) {
      console.log(
        "An error has Occured at ProfileContent.tsx fetching function",
        err
      );
    }
  }

  function handleButtons(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    const dataAttr = target.getAttribute("data-fetch");
    dataAttr && setAction(dataAttr);
  }

  useEffect(() => {
    fetchData();
  }, [action]);

  return (
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
          <li data-fetch="posts active" onClick={handleButtons}>
            Posts
          </li>
          <li data-fetch="likes" onClick={handleButtons}>
            Likes
          </li>
          <li data-fetch="comments" onClick={handleButtons}>
            Replies
          </li>
          <li data-fetch="following" onClick={handleButtons}>
            Following
          </li>
          <li data-fetch="followers" onClick={handleButtons}>
            Followers
          </li>
        </ul>
      </div>
      <section className="profile-page-data">
        {action !== "followers" && action !== "following"
          ? data.map((post: PostType) => {
              !post.user_info ? (post.user_info = user) : null;
              return <Post post={post} key={post._id} />;
            })
          : null}

        {action === "followers" || action === "following"
          ? data.map((content) => {
              return <Follower content={content} loading={loading} />;
            })
          : null}
      </section>
    </section>
  );
}
