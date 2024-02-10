import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { CommunityType } from "../../../../../types";
import { serverUrl } from "../../common";

/// Created a new community , after its accepted.
// the server sends back the community data and the function navigates the user(Admin) to his new community

export async function handleSubmit(
  e: event,
  formData: formData,
  router: AppRouterInstance
) {
  e.preventDefault();
  try {
    const res = await fetch(`${serverUrl}/community/new`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (res.status === 200) {
      const data = await res.json();
      data.id && router.push(`/community/${data.id}`);
    }
  } catch (error) {
    console.log("An error occured at Creating community ");
  }
}

type event = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type formData = Partial<CommunityType>;
