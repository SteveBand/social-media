import { CommunityPost } from "@/components/CommunityPost";
import { CommunityPostType } from "../../../../../types";

export function CommunityPosts({ posts }: { posts: Array<CommunityPostType> }) {
  return (
    <>
      {posts.map((post) => {
        return <CommunityPost content={post} key={post._id} />;
      })}
    </>
  );
}
