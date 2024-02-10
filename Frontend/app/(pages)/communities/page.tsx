"use client";

import { useEffect, useState } from "react";
import { CommunitiesPageHeader } from "../../../components/ui/communities/CommunitiesHeader";
import { CommunityType } from "../../../../types";
import { CommunityLink } from "../../../components/ui/communities/CommunityLink";
import { serverUrl } from "@/app/utils/common";

export default function CommunitiesPage() {
  const [communitieslist, setCommunitiesList] = useState<CommunityType[]>([]);

  // Fetches and updates comminitiesList state with communities data from the DataBase
  async function fetchCommunities() {
    const res = await fetch(`${serverUrl}/communities`, {
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
          return <CommunityLink community={community} key={community._id} />;
        })}
      </section>
    </section>
  );
}
