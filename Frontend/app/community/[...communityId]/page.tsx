import Navbar from "@/components/navbar/Navbar";
import { CommunityContent } from "./components/CommnityContent";
import { Community } from "../../../../types";

export default async function Community({
  params,
}: {
  params: { communityId: string };
}) {
  const communityId = params.communityId[0];

  async function fetchData() {
    const res = await fetch(`http://localhost:4000/community/${communityId}`, {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  }

  const data: any = await fetchData();

  return (
    <section className="community-page-wrapper">
      <Navbar />
      <CommunityContent data={data} />
    </section>
  );
}
