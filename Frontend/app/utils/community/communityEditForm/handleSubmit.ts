import { SetStateAction } from "react";
import { CommunityType } from "../../../../../types";

export async function handleSubmit(
  e: React.MouseEvent<HTMLButtonElement>,
  formData: Partial<CommunityType>,
  id: string,
  setData: React.Dispatch<SetStateAction<CommunityType | undefined>>
) {
  e.preventDefault();
  try {
    const res = await fetch(`http://localhost:4000/community/${id}/edit`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const data = await res.json();
      setData(data);
    }
  } catch (error) {
    console.log(error);
  }
}
