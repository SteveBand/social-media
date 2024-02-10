import { SetStateAction } from "react";
import { CommunityType } from "../../../../types";
import { serverUrl } from "../common";

export async function handleFetch(
  id: string,
  setData: React.Dispatch<SetStateAction<CommunityType | undefined>>
) {
  const res = await fetch(
    `${serverUrl}/community/${id}
`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (res.ok) {
    const content = await res.json();
    setData(content);
  }
}
