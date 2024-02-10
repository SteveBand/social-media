"use client";

import { useEffect, useState } from "react";
import { ProfileContent } from "../../../../components/ui/profile/ProfileContent";
import { UserType } from "../../../../../types";
import { EditProfile } from "../../../../components/ui/profile/EditProfile";
import { serverUrl } from "@/app/utils/common";

export default function ProfilePage({
  params,
}: {
  params: { user: [string] };
}) {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<Partial<UserType> | undefined>();
  const userId = params.user[0];

  async function fetchUser() {
    try {
      const res = await fetch(`${serverUrl}/profile/${userId}`, {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (!user) {
    return;
  }

  return (
    <>
      {!edit ? (
        <ProfileContent setEdit={setEdit} user={user} />
      ) : (
        <EditProfile user={user} setEdit={setEdit} setUser={setUser} />
      )}
    </>
  );
}
