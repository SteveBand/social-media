import { useState } from "react";
import { CommunityType } from "../../../../../types";

export function CommunityAbout({ data }: { data: CommunityType }) {
  const [isMember, setIsMember] = useState(data.isMember || false);
  const [membersCount, setMembersCount] = useState(data.membersCount);

  async function handleJoin(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        !isMember
          ? `http://localhost:4000/community/${data._id}/new/member`
          : `http://localhost:4000/community/${data._id}/delete/member`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setIsMember((prev) => !prev);
        data.newMember === true
          ? setMembersCount((prev) => prev + 1)
          : setMembersCount((prev) => prev - 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="about">
      <h2>{data.title}</h2>
      <p>{data.about}</p>
      <footer>
        <p>{membersCount} Members</p>
        {!isMember && <button onClick={handleJoin}>Join</button>}
        {isMember && (
          <button onClick={handleJoin} className="is-member">
            <span className="joined">Joined</span>
            <span className="leave">Leave</span>
          </button>
        )}
      </footer>
    </div>
  );
}
