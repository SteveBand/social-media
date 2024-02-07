import { CommunityLink } from "@/app/(dashboard)/communities/components/CommunityLink";
import { CommunityType } from "../../../types";

export function CommunitiesResults({
  searchResults,
}: {
  searchResults: CommunityType[];
}) {
  return (
    <section className="results-contianer">
      {searchResults.map((community) => {
        return <CommunityLink community={community} key={community._id} />;
      })}
    </section>
  );
}