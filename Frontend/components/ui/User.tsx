import "@/styles/ui/user/user-style.scss";
import Link from "next/link";
import { UserSkeleton } from "../loaders/UserSkeleton";
import { FollowButton } from "../action-buttons/FollowButton";
import { SlOptions } from "react-icons/sl";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { removeMember } from "@/redux/features/communityMembers-slice";

export function User({ content, loading, path, communityId }: Props) {
  const [isOptions, setIsOptions] = useState(false);

  if (loading) {
    return <UserSkeleton />;
  }
  const user = useAppSelector((state) => state.userReducer);
  const members = useAppSelector(
    (state) => state.communityMembersReducer.communityMembers
  );
  const dispatch = useAppDispatch();

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
        dispatch(removeMember(content._id));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Link
      href={`/profile/${content._id}`}
      className="follower-wrapper"
      onClick={navigation}
    >
      <div className="upper">
        <img src={content.avatar_url} data-navigate={true} />
        <div className="user-content" data-navigate={true}>
          <h5 data-navigate={true}>{content.name}</h5>
          <p data-navigate={true}>{content.bio}</p>
        </div>
        {user.status === "authenticated" &&
          user.user_info._id !== content._id &&
          !isOptions && <FollowButton userData={content} />}
        {path === "community/adminPanel" && (
          <SlOptions
            className="options-icon"
            onClick={() => setIsOptions((prev) => !prev)}
          />
        )}
      </div>

      {isOptions && (
        <button
          className="options-button action-button"
          onClick={handleRemoveMember}
        >
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
