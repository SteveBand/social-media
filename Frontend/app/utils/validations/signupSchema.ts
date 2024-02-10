import Joi from "joi";
import { passwordValidation } from "../common";

export const signupSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .pattern(new RegExp(passwordValidation))
    .messages({
      any: "Password must contain atleast 1 Uppercasse letter 1 Lowercase letter a number and min length of 6",
    })
    .required(),
  firstName: Joi.string().min(2).max(10).required(),
  lastName: Joi.string().min(2).max(14).required(),
  phoneNumber: Joi.number().min(6),
  gender: Joi.string(),
  admin: Joi.boolean(),
});
