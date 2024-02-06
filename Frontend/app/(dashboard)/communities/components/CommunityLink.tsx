import Link from "next/link";
import { CommunityType } from "../../../../../types";

export function CommunityLink({ community }: { community: CommunityType }) {
  return (
    <Link className="community-link" href={`/community/${community._id}`}>
      <img src={community.image} />
      <div className="details">
        <p>{community.title}</p>
        <p>{community.membersCount} Members</p>
        <p>{community.postsCount} Posts</p>
      </div>
    </Link>
  );
}
