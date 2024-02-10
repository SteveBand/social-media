import { PostType } from "../../../types";
import { Comment } from "../ui/Comment";

export function CommentsResults({
  searchResults,
}: {
  searchResults: PostType[];
}) {
  return (
    <>
      {searchResults.map((comment) => {
        return <Comment comment={comment} key={comment._id} />;
      })}
    </>
  );
}
