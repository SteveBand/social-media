import "@/styles/follower/follower-style.scss";
import Link from "next/link";
import { FollowerSkeleton } from "./loaders/FollowersSkeleton";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function Follower({
  content,
  loading,
}: {
  content: any;
  loading: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(
    content.isFollowing
  );
  const { data: session } = useSession();
  const parentId = session?.user?.email;

  if (loading) {
    return <FollowerSkeleton />;
  }

  async function handleFollow(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/new/follow?parentId=${parentId}&follows=${content.email}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setIsFollowing((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUnfollow(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/delete/follow?parentId=${parentId}&follows=${content.email}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setIsFollowing((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Link href={`/profile/${content.email}`} className="follower-wrapper">
      <div className="upper">
        <img src={content.avatar_url} />
        <div className="user-content">
          <h5>{content.name}</h5>
          <p>{content.bio}</p>
        </div>
        {!isFollowing && <button onClick={handleFollow}>Follow</button>}
        {isFollowing && <button onClick={handleUnfollow}>Unfollow</button>}
      </div>
    </Link>
  );
}
