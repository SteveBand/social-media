"use client";

import { useAppSelector } from "@/hooks";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const user = useAppSelector((state) => state.userReducer);
  const router = useRouter();

  if (user.status === "unauthenticated") {
    return <h1>Unauthorized!</h1>;
  }

  if (!user.user_info.admin) {
    return <h1>Unauthorized!</h1>;
  }

  return <section className="admin-container"></section>;
}
