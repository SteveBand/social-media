import { SetStateAction } from "react";
import { serverUrl } from "../../common";

export async function handleSubmit(
  e: event,
  params: params,
  setModal: setModal
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
    setModal(false);
  }
}

type event = React.MouseEvent<HTMLButtonElement>;
type params = {
  content: string;
};
type setModal = React.Dispatch<SetStateAction<boolean>>;
