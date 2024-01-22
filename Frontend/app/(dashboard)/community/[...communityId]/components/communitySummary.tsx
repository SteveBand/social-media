import { useState } from "react";
import { CommunityType } from "../../../../../../types";

export function CommunitySummary({ data }: { data: CommunityType }) {
  const [isMember, setIsMember] = useState(data.isMember || false);
  const [membersCount, setMembersCount] = useState(data.membersCount);

  async function handleJoin(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
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
  }
  console.log(data);
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
