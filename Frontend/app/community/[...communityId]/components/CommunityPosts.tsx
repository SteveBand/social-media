import { CommunityPost } from "@/components/communityPost";
import { CommunityPostType } from "../../../../../types";

export function CommunityPosts({ posts }: { posts: Array<CommunityPostType> }) {
  return (
    <>
      {posts.map((post) => {
        return <CommunityPost content={post} />;
      })}
    </>
  );
}
