import Joi from "joi";

const passwordValidation =
  "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$";

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
  phoneNumber: Joi.number().min(6).required(),
  gender: Joi.string().required(),
});

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

export const passwordSchema = Joi.string()
  .pattern(new RegExp(passwordValidation))
  .messages({
    "string.empty": "",
    "string.pattern.base":
      "Password must contain atleast 1 Uppercase letter 1 Lowercase letter a number and min length of 6",
  })
  .required();

export const editUserSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  name: Joi.string().min(3),
  phoneNumber: Joi.number().min(6),
  gender: Joi.string().valid("male", "female"),
  bio: Joi.string().min(3).max(150),
  avatar_url: Joi.string().max(100),
});
