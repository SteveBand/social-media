const joi = require("joi");

const postSchema = joi.object({
  content: joi.string().min(2).max(200).required(),
  parentId: joi.string().email({ tlds: false }).required(),
  date: joi.string().required(),
});

exports.postSchema = postSchema;
