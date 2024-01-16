import "@/styles/follower/follower-style.scss";
import Link from "next/link";
import { FollowerSkeleton } from "./loaders/FollowersSkeleton";
import { FollowButton } from "./action-buttons/FollowButton";

export function User({ content, loading }: { content: any; loading: boolean }) {
  if (loading) {
    return <FollowerSkeleton />;
  }

  function navigation(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    const target = e.target as HTMLAnchorElement;
    const attribute = target.getAttribute("data-navigate");
    if (!attribute) {
      e.preventDefault();
    }
  }

  return (
    <Link
      href={`/profile/${content.email}`}
      className="follower-wrapper"
      onClick={navigation}
    >
      <div className="upper">
        <img src={content.avatar_url} data-navigate={true} />
        <div className="user-content" data-navigate={true}>
          <h5 data-navigate={true}>{content.name}</h5>
          <p data-navigate={true}>{content.bio}</p>
        </div>
        <FollowButton user={content} />
      </div>
    </Link>
  );
}
