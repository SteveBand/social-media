import { useState } from "react";

export function FollowButton({}) {
  const [following, setFollowing] = useState<boolean>();
  return (
    <button className="follow-button">
      {!following && <span className="follow">Follow</span>}
      {following && <span className="unfollow">Unfollow</span>}
    </button>
  );
}
