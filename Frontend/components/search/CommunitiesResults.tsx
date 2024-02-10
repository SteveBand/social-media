import { CommunityLink } from "@/app/(pages)/communities/components/CommunityLink";
import { CommunityType } from "../../../types";

export function CommunitiesResults({
  searchResults,
}: {
  searchResults: CommunityType[];
}) {
  return (
    <>
      {searchResults.map((community) => {
        return <CommunityLink community={community} key={community._id} />;
      })}
    </>
  );
}
