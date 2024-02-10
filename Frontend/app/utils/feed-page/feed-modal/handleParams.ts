import { SetStateAction } from "react";
import { newPostSchema } from "../../validations/newPostSchma";

export function handleParams(
  e: event,
  params: params,
  setParams: setParams,
  setIsValid: setIsValid
) {
  const { id, value } = e.target;
  const obj = {
    ...params,
    [id]: value,
  };

  setParams(obj);
  const validation = newPostSchema.validate(params, { abortEarly: true });
  if (validation.error !== undefined) {
    const error = validation.error.details.find((e) => e.context?.key === id);
    error && setIsValid(false);
  }
  if (validation.error === undefined) {
    setIsValid(true);
  }
}

type event = React.ChangeEvent<HTMLTextAreaElement>;
type params = {
  content: string;
};
type setParams = React.Dispatch<
  SetStateAction<{
    content: string;
  }>
>;

type setIsValid = React.Dispatch<SetStateAction<boolean>>;
