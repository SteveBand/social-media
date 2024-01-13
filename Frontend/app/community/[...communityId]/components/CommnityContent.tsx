"use client";

import { BackButton } from "@/components/action-buttons/BackButton";
import { CommunityType } from "../../../../../types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { CommunityForm } from "./communityForm";
import { CommunityAbout } from "./communityAbout";

export function CommunityContent({ data }: { data: CommunityType }) {
  const [action, setAction] = useState<string>("top");
  const [isMember, setIsMember] = useState(data.isMember || false);
  const [posts, setPosts] = useState();
  const { data: session } = useSession();

  function handleAction(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    const action = target.getAttribute("data-fetch");
    action && setAction(action);
  }

  // async function handleFetch() {
  //   const res = await fetch(
  //     `http://localhost:4000/community/${data._id}/${action}`,
  //     {
  //       method: "GET",
  //       credentials: "include",
  //     }
  //   );
  //   if (res.ok) {
  //     const data = await res.json();
  //     setContent(data);
  //   }
  // }

  return (
    <section className="community-page-container">
      <header>
        <BackButton />
        <h5>{data.title}</h5>
      </header>
      <img src={data.image} />
      <CommunityAbout data={data} />
      <ul className="actions">
        <li
          data-fetch="top"
          className={action === "top" ? "active" : ""}
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
      <section className="posts-container">
        
      </section>
    </section>
  );
}
