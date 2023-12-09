const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { authGuard } = require("./authGuard");
const { postSchema } = require("../schemas");
module.exports = (app) => {
  const schema = new mongoose.Schema({
    content: String,
    parentId: String,
    date: String,
  });

  const Post = mongoose.model("posts", schema);

  app.post("/new/post", authGuard, async (req, res) => {
    const postBody = await req.body;
    const validation = postSchema.validate(postBody, { abortEarly: true });

    if (validation.error !== undefined) {
      return res.status(400).send({ message: "malware" });
    }

    const post = await Post(postBody).save();

    res.send({ message: "Post successfully created" }).status(200);
  });

  app.get("/posts", async (req, res) => {
    const posts = await Post.find().sort({ date: 1 }).limit(5);
    res.send(posts).status(200);
  });
};
