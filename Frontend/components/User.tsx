import "@/styles/follower/follower-style.scss";
import Link from "next/link";
import { FollowerSkeleton } from "./loaders/FollowersSkeleton";
import { FollowButton } from "./action-buttons/FollowButton";
import { useSession } from "next-auth/react";
import { SlOptions } from "react-icons/sl";
import { useState } from "react";

export function User({ content, loading, path, communityId }: Props) {
  const [isOptions, setIsOptions] = useState(false);
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

  async function handleRemoveMember(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/community/${communityId}/remove/member?memberId=${content._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
      }
    } catch (error) {}
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
        {path === "community/adminPanel" && (
          <SlOptions
            className="options-icon"
            onClick={() => setIsOptions((prev) => !prev)}
          />
        )}
      </div>

      {isOptions && (
        <button className="options-button" onClick={handleRemoveMember}>
          Remove member
        </button>
      )}
    </Link>
  );
}

type Props = {
  content: any;
  loading?: boolean;
  path?: string;
  communityId?: string;
};
