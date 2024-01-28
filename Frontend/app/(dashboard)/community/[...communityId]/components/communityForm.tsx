import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { CommunityType } from "../../../../../../types";
import { useAppSelector } from "@/hooks";

export function CommunityForm({ data }: { data: CommunityType }) {
  const [content, setContent] = useState("");
  const user = useAppSelector((state) => state.userReducer);
  async function handlePost(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/community/${data._id}/new/post?content=${content}&parentId=${user.user_info.email}`,
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
        setContent("");
      }
    } catch (err) {
      console.log(
        "An error has Occured at CommunityContent.tsx Component at handleFetch Function",
        err
      );
    }
  }

  if (!data.isMember) {
    return null;
  }

  return (
    <form>
      <div className="upper">
        {user?.user_info?.image ? (
          <img src={user?.user_info?.image} />
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
      <button onClick={handlePost} className="post-button">
        Post
      </button>
    </form>
  );
}
