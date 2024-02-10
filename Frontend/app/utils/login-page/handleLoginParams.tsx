import { SetStateAction } from "react";
import { loginSchema } from "../validations/loginSchema";

// takes the event which is the Html Form element in this case , pulls out the id and value of the inputs inside the form onChange,
// meaning every change inside an input or textarea Etc... inside the form is being updated to the setLoginParams state.
// after the login parameters are being checked by Joi validation if there is an error the isValid state is valid is false otherwise it true
// when isValid is true then the Html button element is not disabeld

export const handleLoginParams = (
  e: EventType,
  setLoginParams: setLoginParams,
  loginParams: loginParams,
  setIsValid: setIsValid
) => {
  const target = e.target as HTMLInputElement;
  const { id, value } = target;
  const paramsObj = {
    ...loginParams,
    [id]: value,
  };
  setLoginParams(paramsObj);

  const validation = loginSchema.validate(paramsObj, { abortEarly: false });
  // checks if an error exist within validation
  if (validation.error) {
    const error = validation.error.details.find((e) => e.context?.key === id);
    if (error) {
      setIsValid(false);
    }
  }
  if (validation.error === undefined) {
    setIsValid(true);
  }
};

type EventType = React.FormEvent<HTMLFormElement>;
type setLoginParams = React.Dispatch<
  SetStateAction<{
    email: string;
    password: string;
  }>
>;

type loginParams = {
  email: string;
  password: string;
};

type setIsValid = React.Dispatch<SetStateAction<boolean>>;
