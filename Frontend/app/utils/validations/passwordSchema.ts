import { passwordValidation } from "@/app/utils/common";
import Joi from "joi";

export const passwordSchema = Joi.string()
  .pattern(new RegExp(passwordValidation))
  .messages({
    "string.empty": "",
    "string.pattern.base":
      "Password must contain atleast 1 Uppercase letter 1 Lowercase letter a number and min length of 6",
  })
  .required();
