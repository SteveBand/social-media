import { useEffect, useState } from "react";
import { CommunityType } from "../../../../../../types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { activate } from "@/redux/features/loginModal-slice";

export function CommunitySummary({
  data,
  fetchPosts,
}: {
  data: CommunityType;
  fetchPosts: () => Promise<void>;
}) {
  const [isMember, setIsMember] = useState(data.isMember || false);
  const [membersCount, setMembersCount] = useState(data.membersCount);
  const user = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  async function handleJoin(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    if (user.status === "authenticated") {
      try {
        const res = await fetch(
          `http://localhost:4000/community/${data._id}/${
            !isMember ? "new" : "delete"
          }/member`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setIsMember((prev) => !prev);
          setMembersCount((prev) => (data.newMember ? prev + 1 : prev - 1));
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch(activate());
    }
  }

  useEffect(() => {
    if (data.membership === "private") {
      isMember && fetchPosts();
    }
  }, [isMember]);

  return (
    <div className="summary">
      <h2>{data.title}</h2>
      <p>{data.about}</p>
      <footer>
        <p>{membersCount} Members</p>
        {!isMember && <button onClick={handleJoin}>Join</button>}
        {isMember && !data.isAdmin && (
          <button onClick={handleJoin} className="is-member">
            <span className="joined">Joined</span>
            <span className="leave">Leave</span>
          </button>
        )}
      </footer>
    </div>
  );
}
