import Joi, { options } from "joi";
import { tlds } from "@hapi/tlds";

export const signupSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$"))
    .messages({
      any: "Password must contain atleast 1 Uppercase letter 1 Lowercase letter a number and min length of 6",
    })
    .required(),
  firstName: Joi.string().min(2).max(10).required(),
  lastName: Joi.string().min(2).max(14).required(),
  phoneNumber: Joi.number().min(6).max(15),
  gender: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$"))
    .messages({
      any: "Password must contain atleast 1 Uppercase letter 1 Lowercase letter a number and min length of 6",
    })
    .required(),
});
