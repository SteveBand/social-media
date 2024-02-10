import Joi from "joi";
import { passwordValidation } from "../common";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .pattern(new RegExp(passwordValidation))
    .messages({
      any: "Password must contain atleast 1 Uppercase letter 1 Lowercase letter a number and min length of 6",
    })
    .required(),
});
