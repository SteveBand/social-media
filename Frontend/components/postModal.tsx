import { useAppSelector } from "@/hooks";
import { PostType } from "../../types";

export function PostModal({ post, path }: { post: PostType; path: string }) {
  const user = useAppSelector((state) => state.userReducer);

  return (
    <article className="post-options-modal">
      {post.isAuthor || (post.isModerator && <div>Delete Post</div>)}
      {post.isAuthor && <div>Edit Post</div>}
    </article>
  );
}
