"use client";
import { useEffect, useState } from "react";
import { CommunityType, PostType } from "../../../../../types";
import { BackButton } from "@/components/action-buttons/BackButton";
import { CommunitySummary } from "./components/communitySummary";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { CommunityForm } from "./components/CommunityForm";
import { CommunityPosts } from "./components/CommunityPosts";
import { CommunityAbout } from "./components/CommunityAbout";
import { CommunityMembers } from "./components/CommunityMembers";
import { CommunityAdminPanel } from "./components/CommunityAdminPanel/CommunityAdminPanel";
import { fetchMembers } from "@/redux/features/communityMembers-slice";

export default function CommunityPage({
  params,
}: {
  params: { communityId: [string] };
}) {
  const [data, setData] = useState<CommunityType>();
  const [action, setAction] = useState<string>("posts");
  const [posts, setPosts] = useState<PostType[]>([]);
  const members = useAppSelector(
    (state) => state.communityMembersReducer.communityMembers
  );

  const user = useAppSelector((state) => state.userReducer);

  const dispatch = useAppDispatch();
  const id = params.communityId[0];

  async function fetchPosts() {
    const res = await fetch(
      `http://localhost:4000/community/${data?._id}/${action}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    }
  }

  async function handleFetch() {
    const res = await fetch(
      `http://localhost:4000/community/${id}
`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (res.ok) {
      const content = await res.json();
      setData(content);
    }
  }

  function handlePostLikeFunction(
    postId: string,
    isLiked: { liked: boolean; likesCount: number }
  ) {
    const updatedArray = [...posts];
    const index = posts.findIndex((element) => element._id === postId);
    const updatedPost = {
      ...posts[index],
      liked: !isLiked.liked,
      likesCount: !isLiked.liked
        ? isLiked.likesCount + 1
        : isLiked.likesCount - 1,
    };
    updatedArray[index] = updatedPost;
    setPosts(updatedArray);
  }

  function handleAction(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    const action = target.getAttribute("data-fetch");
    action && setAction(action);
  }

  useEffect(() => {
    if (!data) {
      handleFetch();
    }

    if (data) {
      fetchPosts();
      dispatch(fetchMembers(data._id));
    }
  }, [data]);

  if (!data) {
    return <div>No Community</div>;
  }

  return (
    <section className="community-page-container">
      <header>
        <BackButton />
        <h5>{data.title}</h5>
      </header>
      <img className="community-logo" src={data.image} />
      <CommunitySummary data={data} />
      <div className="actions-wrapper">
        <ul className="actions">
          <li
            data-fetch="posts"
            className={action === "posts" ? "active" : ""}
            onClick={handleAction}
          >
            Posts
          </li>
          <li
            data-fetch="about"
            className={action === "about" ? "active" : ""}
            onClick={handleAction}
          >
            About
          </li>
          <li
            data-fetch="members"
            className={action === "members" ? "active" : ""}
            onClick={handleAction}
          >
            Members
          </li>
          {data.isAdmin && (
            <li
              data-fetch="admin-panel"
              className={action === "admin-panel" ? "active" : ""}
              onClick={handleAction}
            >
              AdminPanel
            </li>
          )}
        </ul>
      </div>
      {user.status === "authenticated" && action === "posts" && (
        <CommunityForm data={data} />
      )}
      <section className="community-content">
        {action === "posts" && (
          <CommunityPosts
            posts={posts}
            handlePostLikeFunction={handlePostLikeFunction}
          />
        )}
        {action === "about" && <CommunityAbout data={data} members={members} />}
        {action === "members" && <CommunityMembers members={members} />}
        {action === "admin-panel" && (
          <CommunityAdminPanel
            members={members}
            data={data}
            setData={setData}
          />
        )}
      </section>
    </section>
  );
}
