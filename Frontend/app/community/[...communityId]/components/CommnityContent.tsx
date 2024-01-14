"use client";

import { BackButton } from "@/components/action-buttons/BackButton";
import { CommunityType } from "../../../../../types";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CommunityForm } from "./communityForm";
import { CommunityAbout } from "./communityAbout";
import { CommunityPosts } from "./CommunityPosts";

export function CommunityContent({ data }: { data: CommunityType }) {
  const [action, setAction] = useState<string>("posts");
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState();
  const [moderators, setModerators] = useState();
  const { data: session } = useSession();

  function handleAction(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    const action = target.getAttribute("data-fetch");
    action && setAction(action);
  }

  async function fetchPosts() {
    const res = await fetch(
      `http://localhost:4000/community/${data._id}/${action}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (res.ok) {
      const data = await res.json();
      switch (action) {
        case "posts":
          setPosts(data);
          break;

        case "members":
          setMembers(data);
          break;

        case "moderators":
          setModerators(data);
          break;
      }
    }
  }

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, []);

  return (
    <section className="community-page-container">
      <header>
        <BackButton />
        <h5>{data.title}</h5>
      </header>
      <img className="community-logo" src={data.image} />
      <CommunityAbout data={data} />
      <ul className="actions">
        <li
          data-fetch="posts"
          className={action === "posts" ? "active" : ""}
          onClick={handleAction}
        >
          Top
        </li>
        <li
          data-fetch="about"
          className={action === "about" ? "active" : ""}
          onClick={handleAction}
        >
          About
        </li>
        <li
          data-fetch="members"
          className={action === "members" ? "active" : ""}
          onClick={handleAction}
        >
          Members
        </li>
      </ul>
      {session?.user && <CommunityForm data={data} />}
      <section className="community-content">
        {action === "posts" && <CommunityPosts posts={posts} />}
      </section>
    </section>
  );
}
