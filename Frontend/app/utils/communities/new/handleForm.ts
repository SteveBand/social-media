import { SetStateAction } from "react";
import { CommunityType } from "../../../../../types";

// Setting a State to the form inputs data

export function handleForm(e: event, setFormData: setFormData) {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  const { name, value } = target;
  setFormData((prev) => {
    return {
      ...prev,
      [name]: value,
    };
  });
}

type event = React.FormEvent<HTMLFormElement>;
type setFormData = React.Dispatch<SetStateAction<Partial<CommunityType>>>;
