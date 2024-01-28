
import { PostType } from "../../../../../../types";
import { Post } from "@/components/Post";

export function CommunityPosts({ posts, handlePostLikeFunction }: Props) {
  console.log(posts);
  return (
    <>
      {posts.map((post) => {
        return (
          <Post
            post={post}
            key={post._id}
            handlePostLikeFunction={handlePostLikeFunction}
          />
        );
      })}
    </>
  );
}

type Props = {
  posts: PostType[];
  handlePostLikeFunction?: (
    postId: string,
    isLiked: { liked: boolean; likesCount: number }
  ) => void;
};
