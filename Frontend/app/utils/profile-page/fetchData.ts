import { SetStateAction } from "react";
import { serverUrl } from "../common";
import { DataType } from "@/components/ui/profile/ProfileContent";

export async function fetchData(
  setLoading: setLoading,
  setData: setData,
  userId: string | undefined,
  action: Action
) {
  setLoading(true);
  try {
    const res = await fetch(`${serverUrl}/user/${userId}/${action}`, {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const fetchedData = await res.json();
      setData((prev) => {
        return {
          ...prev,
          [action]: fetchedData,
        };
      });
      setLoading(false);
    }
  } catch (err) {
    console.log(
      "An error has Occured at ProfileContent.tsx fetching function",
      err
    );
  }
}

type setLoading = React.Dispatch<SetStateAction<boolean>>;
type setData = React.Dispatch<SetStateAction<DataType>>;
type Action = "posts" | "comments" | "likes" | "followers" | "following";
