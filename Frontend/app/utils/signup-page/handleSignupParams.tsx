import { SetStateAction } from "react";
import { UserType } from "../../../../types";
import { signupSchema } from "../validations/signupSchema";

export function handleSignupParams(
  e: React.FormEvent<HTMLFormElement>,
  params: Partial<UserType>,
  setParams: setParams,
  setIsValid: setIsValid
) {
  const { id, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
  const obj = {
    ...params,
    [id]: value,
  };
  setParams(obj);
  const validation = signupSchema.validate(params);
  console.log(validation);
  if (validation.error) {
    const error = validation.error.details.find((e) => e.context?.key === id);
    if (error) {
      setIsValid(false);
    }
  }
  if (validation.error === undefined) {
    setIsValid(true);
  }
}

type setParams = React.Dispatch<SetStateAction<Partial<UserType>>>;
type setIsValid = React.Dispatch<SetStateAction<Partial<boolean>>>;
