import { SetStateAction } from "react";
import { PostType } from "../../../../../../types";
import { Post } from "@/components/ui/Post";

export function CommunityPosts({
  posts,
  handlePostLikeFunction,
  setPosts,
}: Props) {
  return (
    <>
      {posts.map((post) => {
        return (
          <Post
            post={post}
            key={post._id}
            handlePostLikeFunction={handlePostLikeFunction}
            setPosts={setPosts}
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
  setPosts: React.Dispatch<SetStateAction<PostType[]>>;
};
