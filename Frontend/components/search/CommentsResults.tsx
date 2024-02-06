import { PostType } from "../../../types";
import { Comment } from "../common/Comment";

export function CommentsResults({
  searchResults,
}: {
  searchResults: PostType[];
}) {
  return (
    <section className="results-container">
      {searchResults.map((comment) => {
        return <Comment comment={comment} key={comment._id} />;
      })}
    </section>
  );
}
