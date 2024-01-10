"use client";

import { BackButton } from "@/components/action-buttons/BackButton";
import { Community } from "../../../../../types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import { CommunityForm } from "./communityForm";

export function CommunityContent({ data }: { data: Community }) {
  const [action, setAction] = useState<string>("top");
  const [content, setContent] = useState();
  const { data: session } = useSession();
  function handleAction(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    const action = target.getAttribute("data-fetch");
    action && setAction(action);
  }

  async function handleFetch() {
    const res = await fetch(
      `http://localhost:4000/community/${data._id}/${action}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (res.ok) {
      const data = await res.json();
      setContent(data);
    }
  }

  async function handlePost(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/community/${data._id}/new/post?content=`
      );
    } catch (err) {
      console.log(
        "An error has Occured at CommunityContent.tsx Component at handleFetch Function",
        err
      );
    }
  }
  return (
    <section className="community-page-container">
      <header>
        <BackButton />
        <h5>{data.title}</h5>
      </header>
      <img src={data.image} />
      <div className="about">
        <h2>{data.title}</h2>
        <p>{data.about}</p>
        <footer>
          <p>{data.membersCount} Members</p>
          <button>Join</button>
        </footer>
      </div>
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
      {session?.user && <CommunityForm />}
    </section>
  );
}
