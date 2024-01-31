import { useState } from "react";
import { CommunityModerator } from "../../../types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { follow, unfollow } from "@/redux/features/communityMembers-slice";

export function FollowButton({ userData }: { userData: CommunityModerator }) {
  const [following, setFollowing] = useState<boolean>(userData.isFollowing);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer);

  async function handleFollow(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/${
          following ? "delete" : "new"
        }/follow?parentId=${user.user_info._id}&follows=${userData._id}`,
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

        !following
          ? dispatch(follow(userData._id))
          : dispatch(unfollow(userData._id));
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
