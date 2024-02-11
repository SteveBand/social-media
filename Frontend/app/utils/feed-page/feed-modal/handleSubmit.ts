import { SetStateAction } from "react";
import { serverUrl } from "../../common";
import { PostType } from "../../../../../types";

export async function handleSubmit(
  e: event,
  params: params,
  setModal: setModal,
  setPosts: setPosts
) {
  e.preventDefault();
  const res = await fetch(`${serverUrl}/new/post`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (res.ok) {
    const data = await res.json();
    setModal(false);
    setPosts((prev) => {
      return [data, ...prev];
    });
  }
}

type event = React.MouseEvent<HTMLButtonElement>;
type params = {
  content: string;
};
type setModal = React.Dispatch<SetStateAction<boolean>>;
type setPosts = React.Dispatch<SetStateAction<PostType[]>>;
