import Joi from "joi";

export const editUserSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  name: Joi.string().min(3),
  phoneNumber: Joi.number().min(6),
  gender: Joi.string().valid("male", "female"),
  bio: Joi.string().min(3).max(150),
  avatar_url: Joi.string().max(100),
});
