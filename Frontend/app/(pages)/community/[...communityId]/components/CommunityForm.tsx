import { SetStateAction, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { CommunityType, PostType } from "../../../../../../types";
import { useAppSelector } from "@/hooks";
import { handlePost } from "../../utils/handlePost";

export function CommunityForm({ data, setPosts }: Props) {
  const [content, setContent] = useState("");
  const user = useAppSelector((state) => state.userReducer);

  if (!data.isMember) {
    return null;
  }

  return (
    <form>
      <div className="upper">
        {user?.user_info?.avatar_url ? (
          <img src={user?.user_info?.avatar_url} />
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
      <button
        onClick={(e) => handlePost(e, setContent, data._id, content, setPosts)}
        className="post-button action-button"
      >
        Post
      </button>
    </form>
  );
}

type Props = {
  data: CommunityType;
  setPosts: React.Dispatch<SetStateAction<PostType[]>>;
};
