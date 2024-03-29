"use client";

import { PostType, UserType } from "../../../../types";
import { SetStateAction, useEffect, useState } from "react";
import { Post } from "@/components/ui/Post";
import { User } from "@/components/ui/User";
import { Comment } from "@/components/ui/Comment";
import { BackButton } from "@/components/action-buttons/BackButton";
import moment from "moment";
import { FollowButton } from "@/components/action-buttons/FollowButton";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useRouter } from "next/navigation";
import { confirmDelete, fetchData } from "@/app/utils/profile-page";
import { serverUrl } from "@/app/utils/common";
import { logIn } from "@/redux/features/auth-slice";

export function ProfileContent({
  setEdit,
  user,
}: {
  setEdit: React.Dispatch<SetStateAction<boolean>>;
  user: Partial<UserType>;
}) {
  const [action, setAction] = useState<Action>("posts");
  const [data, setData] = useState<DataType>({
    posts: [],
    likes: [],
    comments: [],
    following: [],
    followers: [],
  });
  const [loading, setLoading] = useState(true);
  const loggedUser = useAppSelector((state) => state.userReducer.user_info);
  const dispatch = useAppDispatch();
  const router = useRouter();

  function handleButtons(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    const target = e.target as HTMLElement;
    const dataAttr = target.getAttribute("data-fetch");
    dataAttr && setAction(dataAttr as Action);
  }

  function handlePostLikeFunction(
    postId: string,
    isLiked: { liked: boolean; likesCount: number }
  ) {
    const updatedArray = [...data[action]];
    const index = data[action].findIndex((element) => element._id === postId);
    const updatedPost = {
      ...data[action][index],
      liked: !isLiked.liked,
      likesCount: !isLiked.liked
        ? isLiked.likesCount + 1
        : isLiked.likesCount - 1,
    };
    updatedArray[index] = updatedPost;
    setData((prev) => {
      return {
        ...prev,
        [action]: updatedArray,
      };
    });
  }

  const date = user && moment(user.createdAt).format("MMM YY");

  const isFromDifferentSocial = user.googleId || user.githubId ? true : false;

  async function handleLogout() {
    const res = await fetch(`${serverUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      dispatch(
        logIn({
          status: "unauthenticated",
          user_info: {},
        })
      );
      router.push("/");
    }
  }

  useEffect(() => {
    if (data[action] && data[action].length === 0) {
      fetchData(setLoading, setData, user._id, action);
    }
  }, [action]);

  return (
    <section className="profile-page-container">
      <header>
        <BackButton />
        <h4>{user?.name}</h4>
        <div className="header-buttons">
          {loggedUser._id === user._id && !isFromDifferentSocial && (
            <button
              className="action-button"
              onClick={() => setEdit((prev) => !prev)}
            >
              Edit Profile
            </button>
          )}
          {loggedUser._id === user._id && (
            <button
              className="action-button"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              Logout
            </button>
          )}
          {loggedUser.admin && loggedUser._id !== user._id && (
            <button
              className="delete-user-button"
              onClick={(e) => confirmDelete(e, user._id, router)}
            >
              DELETE ACCOUNT
            </button>
          )}
        </div>
      </header>
      <article className="user-content">
        <img src={user?.avatar_url} />
        <div className="content">
          <h5>{user?.name}</h5>
          <p>{user?.bio}</p>
          <p>Joined {date}</p>
          <div className="followers-container">
            <p>{user?.following} Following</p>
            <p>{user?.followers} Followers</p>
            {loggedUser._id !== user._id && <FollowButton userData={user} />}
          </div>
        </div>
      </article>
      <div className="profile-navbar-container">
        <ul className="profile-page-navbar">
          <li
            data-fetch="posts"
            onClick={handleButtons}
            className={`${action === "posts" && "active"}`}
          >
            Posts
          </li>
          <li
            data-fetch="likes"
            onClick={handleButtons}
            className={`${action === "likes" && "active"}`}
          >
            Likes
          </li>
          <li
            data-fetch="comments"
            onClick={handleButtons}
            className={`${action === "comments" && "active"}`}
          >
            Replies
          </li>
          <li
            data-fetch="following"
            onClick={handleButtons}
            className={`${action === "following" && "active"}`}
          >
            Following
          </li>
          <li
            data-fetch="followers"
            onClick={handleButtons}
            className={`${action === "followers" && "active"}`}
          >
            Followers
          </li>
        </ul>
      </div>
      <section className="profile-page-data">
        {action !== "followers" && action !== "following"
          ? data[action].map((post: PostType) => {
              return post.isComment ? (
                <Comment
                  comment={post}
                  handlePostLikeFunction={handlePostLikeFunction}
                  key={post._id}
                />
              ) : (
                <Post
                  post={post}
                  key={post._id}
                  handlePostLikeFunction={handlePostLikeFunction}
                  setData={setData}
                />
              );
            })
          : null}

        {action === "followers" || action === "following"
          ? data[action].map((content) => {
              return (
                <User content={content} loading={loading} key={content._id} />
              );
            })
          : null}
      </section>
    </section>
  );
}

export type DataType = {
  posts: PostType[];
  comments: PostType[];
  likes: PostType[];
  followers: UserType[];
  following: UserType[];
};

type Action = "posts" | "comments" | "likes" | "followers" | "following";
