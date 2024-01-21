"use client";

import { BackButton } from "@/components/action-buttons/BackButton";
import { CommunityType, UserType } from "../../../../../../types";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { CommunityForm } from "./communityForm";
import { CommunitySummary } from "./communitySummary";
import { CommunityPosts } from "./CommunityPosts";
import { CommunityAbout } from "./communityAbout";
import { CommunityMembers } from "./CommunityMembers";
import { fetchMembers } from "@/redux/features/communityMembers-slice";
import { useAppSelector, useAppDispatch } from "@/hooks";

export function CommunityContent({ data }: { data: CommunityType }) {
  const [action, setAction] = useState<string>("posts");
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const members = useAppSelector(
    (state) => state.communityMembersReducer.communityMembers
  );
  const dispatch = useAppDispatch();

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
      setPosts(data);
    }
  }

  useEffect(() => {
    if (action === "posts" && posts.length <= 0) {
      fetchPosts();
    }

    if (action === "members" || action === "about") {
      dispatch(fetchMembers(data._id));
    }
  }, [action]);

  return (
    <section className="community-page-container">
      <header>
        <BackButton />
        <h5>{data.title}</h5>
      </header>
      <img className="community-logo" src={data.image} />
      <CommunitySummary data={data} />
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
      {session?.user && action === "posts" && <CommunityForm data={data} />}
      <section className="community-content">
        {action === "posts" && <CommunityPosts posts={posts} />}
        {action === "about" && <CommunityAbout data={data} members={members} />}
        {action === "members" && <CommunityMembers members={members} />}
      </section>
    </section>
  );
}

export interface CommunityMember extends UserType {
  isFollowing: boolean;
  IsModerator: boolean;
}
