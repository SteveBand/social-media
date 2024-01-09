"use client";

import { BackButton } from "@/components/action-buttons/BackButton";
import { Community } from "../../../../../types";
import { useState } from "react";

export function CommunityContent({ data }: { data: Community }) {
  const [action, setAction] = useState<string>("top");
  const [content, setContent] = useState();
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
    </section>
  );
}
