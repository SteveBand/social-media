import { useSession } from "next-auth/react";
import { useState } from "react";
import { CommunityModerator } from "../../../types";
import { useAppDispatch } from "@/hooks";
import { follow, unfollow } from "@/redux/features/communityMembers-slice";

export function FollowButton({ user }: { user: CommunityModerator }) {
  const [following, setFollowing] = useState<boolean>(user.isFollowing);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const parentId = session?.user?.email;
  async function handleFollow(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/${
          following ? "delete" : "new"
        }/follow?parentId=${parentId}&follows=${user.email}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setFollowing((prev) => !prev);
        !following ? dispatch(follow(user.id)) : dispatch(unfollow(user.id));
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <button className="follow-button" onClick={handleFollow}>
      {!following && <span className="follow">Follow</span>}
      {following && <span className="unfollow">Unfollow</span>}
    </button>
  );
}
