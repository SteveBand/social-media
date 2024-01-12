import { useSession } from "next-auth/react";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { CommunityType } from "../../../../../types";

export function CommunityForm({ data }: { data: CommunityType }) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  async function handlePost(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/community/${data._id}/new/post?content=${content}&parentId=${session?.user?.email}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const post = await res.json();
      }
    } catch (err) {
      console.log(
        "An error has Occured at CommunityContent.tsx Component at handleFetch Function",
        err
      );
    }
  }

  return (
    <form>
      <div className="upper">
        {session?.user?.image ? (
          <img src={session?.user?.image} />
        ) : (
          <CgProfile />
        )}
        <div className="upper-content">
          <textarea
            placeholder="Start a post..."
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
      </div>
      <button onClick={handlePost}>Post</button>
    </form>
  );
}
