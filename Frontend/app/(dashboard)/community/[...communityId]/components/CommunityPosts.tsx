import { SetStateAction } from "react";
import { PostType } from "../../../../../../types";
import { Post } from "@/components/Post";

export function CommunityPosts({ posts, setPosts }: Props) {
  return (
    <>
      {posts.map((post) => {
        return <Post post={post} key={post._id} setPosts={setPosts} />;
      })}
    </>
  );
}

type Props = {
  posts: PostType[];
  setPosts: React.Dispatch<SetStateAction<PostType[]>>;
};
