import { PostType } from "../../../types";
import { Post } from "../ui/Post";

export function PostsResults({ searchResults }: { searchResults: PostType[] }) {
  return (
    <>
      {searchResults.map((post) => {
        return <Post post={post} key={post._id} />;
      })}
    </>
  );
}
