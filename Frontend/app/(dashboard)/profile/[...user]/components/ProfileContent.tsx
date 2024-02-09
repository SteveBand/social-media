"use client";

import { PostType, UserType } from "../../../../../../types";
import { SetStateAction, useEffect, useState } from "react";
import { Post } from "@/components/common/Post";
import { User } from "@/components/common/User";
import { Comment } from "@/components/common/Comment";
import { BackButton } from "@/components/common/action-buttons/BackButton";
import moment from "moment";
import { FollowButton } from "@/components/common/action-buttons/FollowButton";
import { useAppSelector } from "@/hooks";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/user/${user._id}/${action}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (res.ok) {
        const fetchedData = await res.json();
        setData((prev) => {
          return {
            ...prev,
            [action]: fetchedData,
          };
        });
        setLoading(false);
      }
    } catch (err) {
      console.log(
        "An error has Occured at ProfileContent.tsx fetching function",
        err
      );
    }
  }

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

  function confirmDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this User?")) {
      handleDeleteUser();
    } else {
      console.log("Cancelled");
    }
  }

  async function handleDeleteUser() {
    try {
      const res = await fetch(`http://localhost:4000/user/${user._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (data[action] && data[action].length === 0) {
      fetchData();
    }
  }, [action]);

  return (
    <section className="profile-page-container">
      <header>
        <BackButton />
        <h4>{user?.name}</h4>
        {loggedUser._id === user._id && (
          <button
            className="action-button"
            onClick={() => setEdit((prev) => !prev)}
          >
            Edit Profile
          </button>
        )}
        {loggedUser.admin && loggedUser._id !== user._id && (
          <button className="delete-user-button" onClick={confirmDelete}>
            DELETE ACCOUNT
          </button>
        )}
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
