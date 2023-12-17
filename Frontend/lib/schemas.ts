import Joi from "joi";

export const PostSchema = Joi.object({
  content: Joi.string().min(4).max(200).required(),
  date: Joi.string(),
});
