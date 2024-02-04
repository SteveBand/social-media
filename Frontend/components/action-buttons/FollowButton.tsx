import { useState } from "react";
import { CommunityModerator, UserType } from "../../../types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { follow, unfollow } from "@/redux/features/communityMembers-slice";
import { activate } from "@/redux/features/loginModal-slice";

export function FollowButton({ userData }: { userData: Partial<UserType> }) {
  const [following, setFollowing] = useState<boolean>(
    userData?.isFollowing ?? false
  );

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userReducer);

  async function handleFollow(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      if (user.status === "authenticated") {
        const res = await fetch(
          `http://localhost:4000/${
            following ? "delete" : "new"
          }/follow?parentId=${user.user_info._id}&follows=${userData?._id}`,
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
            ? dispatch(follow(userData?._id))
            : dispatch(unfollow(userData?._id));
        }
      } else {
        dispatch(activate());
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
