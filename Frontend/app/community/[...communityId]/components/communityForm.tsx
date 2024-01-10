import { useSession } from "next-auth/react";
import { CgProfile } from "react-icons/cg";

export function CommunityForm() {
  const { data: session } = useSession();

  async function handlePost(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/community/${data._id}/new/post?content=`
      );
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
          <textarea placeholder="Start a post..." />
        </div>
      </div>
      <button onClick={(e) => e.preventDefault()}>Post</button>
    </form>
  );
}
