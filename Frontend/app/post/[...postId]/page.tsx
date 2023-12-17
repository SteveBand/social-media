import { headers } from "next/headers";
import { PostType } from "../../../../types";

export default async function PostPage({
  params,
}: {
  params: { postId: [string] };
}) {
  const urlParams = params.postId.pop();
  const postData: Partial<PostType> = await fetch(
    `http://localhost:4000/post/${urlParams}`,
    {
      cache: "no-cache",
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((data) => data.json());

  console.log(postData);

  return (
    <section className="post-page-wrapper">
      <section className="post-page-container">
        <article className="main-post">
          <div className="upper-post">
            <div>
              <img src={postData.user_info?.avatar_url} />
              <p>{postData.user_info?.name}</p>
            </div>
            <div className="action-buttons">
              <button className="subscribe-btn">Subscribe</button>
              
            </div>
          </div>
        </article>
      </section>
    </section>
  );
}
