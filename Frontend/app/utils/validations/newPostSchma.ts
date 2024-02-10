import Joi from "joi";

export const newPostSchema = Joi.object({
  content: Joi.string().min(4).max(200).required(),
});
