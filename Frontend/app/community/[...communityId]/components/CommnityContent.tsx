"use client";

import { BackButton } from "@/components/action-buttons/BackButton";
import { CommunityType } from "../../../../../types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { CommunityForm } from "./communityForm";

export function CommunityContent({ data }: { data: CommunityType }) {
  const [action, setAction] = useState<string>("top");
  const [isMember, setIsMember] = useState(data.isMember || false);
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

  async function handleJoin(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/community/${data._id}/new/member`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (res.ok) {
        setIsMember(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLeave(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/community/${data._id}/delete/member`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (res.ok) {
        setIsMember(false);
      }
    } catch (error) {}
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
          {!isMember && <button onClick={handleJoin}>Join</button>}
          {isMember && (
            <button onClick={handleLeave} className="is-member">
              <span className="joined">Joined</span>
              <span className="leave">Leave</span>
            </button>
          )}
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
      {session?.user && <CommunityForm data={data} />}
    </section>
  );
}
