import { User } from "../../types";

type Props = {
  userInfo: User;
};

export function ProfileImage({ userInfo }: Props) {
  return (
    <>
      <img src={userInfo.avatar_url} className="post-profile-icon" />
    </>
  );
}
