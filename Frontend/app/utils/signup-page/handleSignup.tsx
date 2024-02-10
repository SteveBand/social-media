import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UserType } from "../../../../types";
import { serverUrl } from "../common";

export async function handleSignup(
  event: Event,
  params: Partial<UserType>,
  router: AppRouterInstance
) {
  event.preventDefault();
  try {
    const res = await fetch(`${serverUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    if (res.status === 200) {
      router.push("/login");
    }
  } catch (error) {
    console.log(error);
  }
}

type Event = React.MouseEvent<HTMLButtonElement>;
