"use client";

import { FaArrowLeft } from "react-icons/fa";
import { PostType, UserType } from "../../../../../../types";
import { useEffect, useState } from "react";
import { Post } from "@/components/Post";
import { User } from "@/components/User";
import { Comment } from "@/app/(dashboard)/post/[...postId]/components/Comment";
import { BackButton } from "@/components/action-buttons/BackButton";

export function ProfileContent({ user }: { user: UserType }) {
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
        <BackButton />
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
          <li
            data-fetch="posts"
            onClick={handleButtons}
            className={`${action === "posts" && "active"}`}
          >
            Posts
          </li>
          <li
            data-fetch="likes"
            onClick={handleButtons}
            className={`${action === "likes" && "active"}`}
          >
            Likes
          </li>
          <li
            data-fetch="comments"
            onClick={handleButtons}
            className={`${action === "comments" && "active"}`}
          >
            Replies
          </li>
          <li
            data-fetch="following"
            onClick={handleButtons}
            className={`${action === "following" && "active"}`}
          >
            Following
          </li>
          <li
            data-fetch="followers"
            onClick={handleButtons}
            className={`${action === "followers" && "active"}`}
          >
            Followers
          </li>
        </ul>
      </div>
      <section className="profile-page-data">
        {action !== "followers" && action !== "following"
          ? data.map((post: PostType) => {
              !post.user_info ? (post.user_info = user) : null;
              return post.isComment ? (
                <Comment comment={post} />
              ) : (
                <Post post={post} key={post._id} />
              );
            })
          : null}

        {action === "followers" || action === "following"
          ? data.map((content) => {
              return <User content={content} loading={loading} />;
            })
          : null}
      </section>
    </section>
  );
}
