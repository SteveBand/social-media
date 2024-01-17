import "@/styles/follower/follower-style.scss";
import Link from "next/link";
import { FollowerSkeleton } from "./loaders/FollowersSkeleton";
import { FollowButton } from "./action-buttons/FollowButton";
import { useSession } from "next-auth/react";

export function User({ content, loading }: { content: any; loading: boolean }) {
  if (loading) {
    return <FollowerSkeleton />;
  }

  const { data: session } = useSession();
  const user = session?.user;

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
        {user && user.email !== content.email && (
          <FollowButton user={content} />
        )}
      </div>
    </Link>
  );
}
