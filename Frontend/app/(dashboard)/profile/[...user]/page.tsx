import { ProfileContent } from "./components/ProfileContent";
import { UserType } from "../../../../../types";

export default async function ProfilePage({
  params,
}: {
  params: { user: [string] };
}) {
  const userId = params.user.pop();
  const user: UserType = await fetch(
    `http://localhost:4000/profile/${userId}`,
    {
      method: "GET",
      credentials: "include",
    }
  ).then((data) => data.json());

  return <ProfileContent user={user} />;
}
