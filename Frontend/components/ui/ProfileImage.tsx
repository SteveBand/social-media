import { UserType } from "../../../types";
import { useRouter } from "next/navigation";
import "@/styles/ui/profileImage/profileImage.scss";
import { CgProfile } from "react-icons/cg";

type Props = {
  userInfo: UserType;
};

export function ProfileImage({ userInfo }: Props) {
  const router = useRouter();

  const image = userInfo.avatar_url ? (
    <img src={userInfo.avatar_url} className="post-profile-icon" />
  ) : (
    <CgProfile className="post-profile-icon" />
  );

  return (
    <>
      {image}
      <div
        className="profile-pop-modal"
        onClick={() => router.push(`/profile/${userInfo._id}`)}
      >
        {image}
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
