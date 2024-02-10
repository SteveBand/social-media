import { UserType } from "../../../types";
import { useRouter } from "next/navigation";
import "@/styles/ui/profileImage/profileImage.scss";

type Props = {
  userInfo: UserType;
};

export function ProfileImage({ userInfo }: Props) {
  const router = useRouter();
  return (
    <>
      <img src={userInfo?.avatar_url} className="post-profile-icon" />
      <div
        className="profile-pop-modal"
        onClick={() => router.push(`/profile/${userInfo._id}`)}
      >
        <img src={userInfo?.avatar_url} />
        <h5>{userInfo?.name}</h5>
        <p>{userInfo?.bio}</p>
        <div className="followers">
          <p>{`${userInfo?.followers} Followers`}</p>
          <p>{`${userInfo?.following} Following`}</p>
        </div>
      </div>
    </>
  );
}
