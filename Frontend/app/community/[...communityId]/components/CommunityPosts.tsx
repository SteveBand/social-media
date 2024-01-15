import { CommunityPost } from "@/components/CommunityPost";
import { CommunityPostType, PostType } from "../../../../../types";
import { Post } from "@/components/Post";

export function CommunityPosts({ posts }: { posts: Array<PostType> }) {
  return (
    <>
      {posts.map((post) => {
        return <Post post={post} key={post._id} />;
      })}
    </>
  );
}
