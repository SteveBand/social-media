"use client";

import { useEffect, useState } from "react";
import { CommunitiesPageHeader } from "./components/CommunitiesHeader";
import { CommunityType } from "../../../types";
import Link from "next/link";
import { CommunityLink } from "./components/CommunityLink";

export default function CommunitiesPage() {
  const [communitieslist, setCommunitiesList] = useState<CommunityType[]>([]);

  async function fetchCommunities() {
    const res = await fetch("http://localhost:4000/communities", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setCommunitiesList(data);
    }
  }

  useEffect(() => {
    if (communitieslist.length <= 0) {
      fetchCommunities();
    }
  }, []);
  return (
    <section className="communities-page-container">
      <CommunitiesPageHeader />
      <section className="communities-list">
        {communitieslist.map((community) => {
          return <CommunityLink community={community} />;
        })}
      </section>
    </section>
  );
}
