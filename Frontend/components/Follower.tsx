import "@/styles/follower/follower-style.scss";
import Link from "next/link";
import { FollowerSkeleton } from "./loaders/FollowersSkeleton";

export function Follower({
  content,
  loading,
}: {
  content: any;
  loading: boolean;
}) {
  if (loading) {
    return <FollowerSkeleton />;
  }
  return (
    <Link href={`/profile/${content.email}`} className="follower-wrapper">
      <div className="upper">
        <img src={content.avatar_url} />
        <div className="user-content">
          <h5>{content.name}</h5>
          <p>{content.bio}</p>
        </div>
        <button>Follow</button>
      </div>
    </Link>
  );
}
