"use client";

import Navbar from "@/components/navbar/Navbar";
import { useEffect, useState } from "react";
import { CommunityContent } from "./components/CommnityContent";
import { CommunityType } from "../../../../types";

export default function CommunityPage({
  params,
}: {
  params: { communityId: [string] };
}) {
  const [data, setData] = useState<CommunityType>();
  const id = params.communityId[0];
  async function handleFetch() {
    const res = await fetch(
      `http://localhost:4000/community/${id}
`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (res.ok) {
      const content = await res.json();
      setData(content);
    }
  }

  useEffect(() => {
    handleFetch();
  }, []);

  if (!data) {
    return <div>No Community</div>;
  }

  return (
    <section className="community-page-wrapper">
      <Navbar />
      <CommunityContent data={data} />
    </section>
  );
}
