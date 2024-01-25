const joi = require("joi");

const postSchema = joi.object({
  content: joi.string().min(2).max(200).required(),
});

exports.postSchema = postSchema;
