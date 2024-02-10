import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { serverUrl } from "../common";

async function handleDeleteUser(
  userId: string | undefined,
  router: AppRouterInstance
) {
  try {
    const res = await fetch(`${serverUrl}/user/${userId}`, {
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

export function confirmDelete(
  e: React.MouseEvent<HTMLButtonElement>,
  userId: string | undefined,
  router: AppRouterInstance
) {
  e.preventDefault();
  if (window.confirm("Are you sure you want to delete this User?")) {
    handleDeleteUser(userId, router);
  } else {
    console.log("Cancelled");
  }
}
