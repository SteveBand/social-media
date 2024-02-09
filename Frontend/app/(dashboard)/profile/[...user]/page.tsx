"use client";

import { useEffect, useState } from "react";
import { ProfileContent } from "./components/ProfileContent";
import { UserType } from "../../../../../types";
import { EditProfile } from "./components/EditProfile";

export default function ProfilePage({
  params,
}: {
  params: { user: [string] };
}) {
  const [edit, setEdit] = useState(true);
  const [user, setUser] = useState<Partial<UserType>>();
  const userId = params.user[0];

  async function fetchUser() {
    try {
      const res = await fetch(`http://localhost:4000/profile/${userId}`, {
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
    return <h1>No user</h1>;
  }

  return (
    <>
      {!edit ? (
        <ProfileContent setEdit={setEdit} user={user} />
      ) : (
        <EditProfile user={user} />
      )}
    </>
  );
}
