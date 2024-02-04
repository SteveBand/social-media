"use client";

import { UserType } from "../../../../../types";
import { ProfileContent } from "./components/ProfileContent";
import { useEffect, useMemo, useState } from "react";

export default function ProfilePage({
  params,
}: {
  params: { user: [string] };
}) {
  const userId = params.user[0];

  return <ProfileContent userId={userId} />;
}
